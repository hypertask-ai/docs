#!/usr/bin/env bash
# Daily HypertaskDocs changelog updater.
# Runs via cron, queries Hypertask project 15 section "Review",
# asks Claude to update the changelog (and related pages) per HypertaskDocs/CLAUDE.md,
# commits + pushes on change (Cloudflare Pages auto-deploys),
# sends a Telegram message when something was actually added.

set -euo pipefail

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
REPO="/home/valentin/projects/HypertaskDocs"
LOG_DIR="${HOME}/.logs/daily-changelog"
DATE_STAMP="$(date +%Y-%m-%d)"
LOG_FILE="${LOG_DIR}/${DATE_STAMP}.log"
TICKETS_FILE="$(mktemp -t ht-tickets.XXXXXX.json)"
CLAUDE_OUT="$(mktemp -t ht-claude-out.XXXXXX.txt)"

trap 'rm -f "$TICKETS_FILE" "$CLAUDE_OUT"' EXIT

mkdir -p "$LOG_DIR"
exec > >(tee -a "$LOG_FILE") 2>&1

echo ""
echo "===== $(date -Is) daily-changelog starting ====="

# ---------------------------------------------------------------------------
# Load env (cron has a minimal env; pull Telegram creds + PATH from .bashrc)
# ---------------------------------------------------------------------------
if [[ -f "${HOME}/.bashrc" ]]; then
  # shellcheck disable=SC1091
  set +u
  source "${HOME}/.bashrc" || true
  set -u
fi
export PATH="${HOME}/.local/bin:${HOME}/.npm-global/bin:/usr/local/bin:/usr/bin:/bin:${PATH}"

TG_TOKEN="${TELEGRAM_HYPERTASK_BOT_TOKEN:-}"
TG_CHAT="${TELEGRAM_HYPERTASK_CHAT_ID:-}"

send_telegram() {
  local msg="$1"
  if [[ -z "$TG_TOKEN" || -z "$TG_CHAT" ]]; then
    echo "WARN: Telegram creds missing, skipping notify"
    return 0
  fi
  curl -fsS -X POST "https://api.telegram.org/bot${TG_TOKEN}/sendMessage" \
    --data-urlencode "chat_id=${TG_CHAT}" \
    --data-urlencode "text=${msg}" \
    --data-urlencode "parse_mode=HTML" \
    --data-urlencode "disable_web_page_preview=false" \
    >/dev/null || echo "WARN: Telegram send failed"
}

fail() {
  local msg="$1"
  echo "FATAL: $msg"
  send_telegram "⚠️ <b>HypertaskDocs daily changelog failed</b>%0A${msg}%0ALog: ${LOG_FILE}"
  exit 1
}

# ---------------------------------------------------------------------------
# Pre-flight
# ---------------------------------------------------------------------------
command -v hypertask >/dev/null || fail "hypertask CLI not in PATH"
command -v claude    >/dev/null || fail "claude CLI not in PATH"
command -v git       >/dev/null || fail "git not in PATH"
command -v jq        >/dev/null || fail "jq not in PATH"
[[ -d "$REPO/.git"  ]]          || fail "repo missing at $REPO"

cd "$REPO"

# Bail if the working tree is dirty — we don't want to overwrite manual edits
if [[ -n "$(git status --porcelain)" ]]; then
  fail "working tree is dirty, not running automated changelog. Clean $REPO then retry."
fi

echo "-- git pull"
git pull --ff-only origin main || fail "git pull failed"

# ---------------------------------------------------------------------------
# Fetch Review tickets from project 15 as JSON
# ---------------------------------------------------------------------------
echo "-- fetching Review tickets"
hypertask --json task list --project 15 --section Review --limit 100 > "$TICKETS_FILE" \
  || fail "hypertask list failed"

TICKET_COUNT="$(jq '.tasks | length // (. | length) // 0' "$TICKETS_FILE" 2>/dev/null || echo 0)"
echo "-- fetched $TICKET_COUNT tickets"

if [[ "$TICKET_COUNT" -eq 0 ]]; then
  echo "No tickets in Review. Exiting silently."
  exit 0
fi

SHA_BEFORE="$(git rev-parse HEAD)"

# ---------------------------------------------------------------------------
# Run Claude headless to update the docs
# ---------------------------------------------------------------------------
PROMPT=$(cat <<EOF
You are running in a cron job inside the HypertaskDocs repo. Today is ${DATE_STAMP}.

Your job: update the changelog (and any related feature pages) based on tickets currently in the "Review" section of Hypertask project 15, then post a notification comment on each ticket you covered.

RULES — read these first:
1. Read CLAUDE.md in this repo for the contribution guide, format, categories, filtering rules, and style guide. Follow it exactly.
2. The ticket list is in JSON at: ${TICKETS_FILE}
3. Only include HTPR-* tickets. Skip anything else.
4. Skip privacy-sensitive bugs (cross-tenant, user data leaks).
5. Skip test tickets ("test", "testtask", etc.).
6. Reframe bugs as user-facing fixes ("Fixed: X").
7. Check src/content/docs/changelog/index.mdx for tickets already listed — do not duplicate.
8. Add new entries under today's date heading (${DATE_STAMP} format per CLAUDE.md — "Month Day, Year"). Newest entries at the top.
9. If any feature pages (src/content/docs/features/*.mdx, mcp/*.mdx, api/*.mdx) clearly need updating based on a ticket (new CLI command, new MCP tool, new user-visible feature), update them too.
10. After changes: run \`git add -A\`, \`git commit\` with message "Daily changelog: N entries (YYYY-MM-DD)", \`git push origin main\`.
11. If nothing is worth adding, do NOT commit. Skip straight to the RESULT line.

AFTER the push succeeds, for EACH HTPR ticket you added to the changelog, post a comment via the Hypertask CLI:

  hypertask comment add HTPR-XXXX --text '<p>📚 This ticket is now documented in the public changelog: <a href="https://docs.hypertask.ai/changelog/">docs.hypertask.ai/changelog</a></p><p>Stakeholders — please review the entry (and any feature pages linked from it) and reply here with corrections, missing context, or anything to reframe. The docs auto-sync daily from this board.</p>'

Hypertask comments MUST be HTML (not Markdown). Do not embed images — use plain anchor tags for any URLs. If a feature page was also updated for this ticket, add a second <p> with its URL (e.g. https://docs.hypertask.ai/features/ai-features/).

If a comment post fails for one ticket, log the failure and continue with the others. Do not abort the whole run.

OUTPUT — at the very end, print one machine-readable line:
RESULT: changed=<0|1> entries=<n> pages_updated=<comma-separated paths or "none"> tickets=<comma-separated HTPR-IDs or "none"> comments=<n_posted> summary=<short human line>

Do not print anything else on that RESULT line. Do not omit it.
EOF
)

echo "-- running claude -p"
claude -p "$PROMPT" \
  --permission-mode bypassPermissions \
  --add-dir "$REPO" \
  --model sonnet \
  > "$CLAUDE_OUT" 2>&1 || fail "claude -p exited non-zero. See $CLAUDE_OUT"

echo "-- claude output (tail):"
tail -30 "$CLAUDE_OUT"

RESULT_LINE="$(grep -E '^RESULT:' "$CLAUDE_OUT" | tail -1 || true)"
if [[ -z "$RESULT_LINE" ]]; then
  fail "claude did not emit a RESULT line. See $CLAUDE_OUT"
fi

CHANGED="$(echo   "$RESULT_LINE" | sed -nE 's/.*changed=([0-9]+).*/\1/p')"
ENTRIES="$(echo   "$RESULT_LINE" | sed -nE 's/.*entries=([0-9]+).*/\1/p')"
PAGES="$(echo     "$RESULT_LINE" | sed -nE 's/.*pages_updated=([^ ]+).*/\1/p')"
TICKETS="$(echo   "$RESULT_LINE" | sed -nE 's/.*tickets=([^ ]+).*/\1/p')"
COMMENTS="$(echo  "$RESULT_LINE" | sed -nE 's/.*comments=([0-9]+).*/\1/p')"
SUMMARY="$(echo   "$RESULT_LINE" | sed -nE 's/.*summary=(.*)$/\1/p')"

SHA_AFTER="$(git rev-parse HEAD)"

# ---------------------------------------------------------------------------
# Telegram notify — only when something actually landed
# ---------------------------------------------------------------------------
if [[ "$CHANGED" == "1" && "$SHA_BEFORE" != "$SHA_AFTER" ]]; then
  MSG="📚 <b>HypertaskDocs updated</b>%0A"
  MSG+="<b>${ENTRIES:-?}</b> changelog entries added"
  if [[ -n "${COMMENTS:-}" && "${COMMENTS}" != "0" ]]; then
    MSG+=" · ${COMMENTS} ticket comments posted"
  fi
  MSG+="%0A"
  if [[ -n "${SUMMARY:-}" ]]; then
    MSG+="<i>${SUMMARY}</i>%0A"
  fi
  MSG+="%0AChangelog: https://docs.hypertask.ai/changelog/"
  if [[ -n "${PAGES:-}" && "${PAGES}" != "none" ]]; then
    MSG+="%0APages updated: ${PAGES}"
  fi
  if [[ -n "${TICKETS:-}" && "${TICKETS}" != "none" ]]; then
    MSG+="%0ATickets notified: ${TICKETS}"
  fi
  send_telegram "$MSG"
  echo "-- telegram sent"
else
  echo "-- no changes; skipping telegram"
fi

echo "===== done ====="
exit 0
