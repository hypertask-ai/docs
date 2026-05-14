#!/usr/bin/env bash
# ============================================================================
# DEPRECATED 2026-05-14 — DO NOT RUN.
# Superseded by the `hypertask-docs-agent` Cloudflare Worker in the agent-fleet
# repo (~/projects/agent-fleet/workers/docs-agent). The VPS cron that invoked
# this script was disabled in the crontab on 2026-05-14; the worker now does
# the same job (and more: section-agnostic monitoring, 📚-marker dedup, volume
# cap) on Cloudflare's reliable cron. Build+deploy of the docs site now happens
# via HypertaskDocs/.github/workflows/deploy.yml. Kept only for reference.
# ============================================================================
#
# Daily HypertaskDocs changelog updater.
# Runs via cron, queries Hypertask project 15 section "Review",
# asks Claude to update the changelog (and related pages) per HypertaskDocs/CLAUDE.md,
# commits + pushes on change, builds + deploys to Cloudflare Pages via wrangler,
# sends a Telegram message when something was actually added.
#
# NOTE: The CF Pages project `hypertask-docs` is NOT connected to GitHub
# (source: null), so `git push` alone does NOT trigger a deploy.
# This script runs `wrangler pages deploy` explicitly after the push.

set -euo pipefail

echo "DEPRECATED: this script is disabled — see hypertask-docs-agent CF Worker. Exiting." >&2
exit 0

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

Your job: keep the documentation pages COMPLETE and CURRENT based on tickets in the "Review" section of Hypertask project 15. The pages are the product spec — they must always reflect what Hypertask can do today. The changelog is secondary, used only for noteworthy launches and user-visible fixes.

MENTAL MODEL — pages first, changelog second:
- Pages = canonical, complete reference (CLI, MCP tools, features). If we ship something, the relevant page MUST describe it.
- Changelog = highlights reel. Only entries that a user would care about: new features worth announcing, behavior changes, user-visible bug fixes. Internal refactors, perf tweaks, and tiny bug fixes do NOT belong in the changelog (but may still update a page if they change documented behavior).

CLASSIFY EACH TICKET:
A. New / changed feature, command, MCP tool, API surface, or user-visible behavior
   → MUST update the canonical page(s). Pages to choose from:
     - src/content/docs/cli/reference.mdx       (any CLI command / flag)
     - src/content/docs/mcp/overview.mdx        (MCP setup / config)
     - src/content/docs/mcp/workflows.mdx       (agent workflow patterns)
     - src/content/docs/mcp/scheduling.mdx      (scheduled agents)
     - src/content/docs/api/tools-reference.mdx (MCP tool list / schemas)
     - src/content/docs/features/*.mdx          (AI features, boards, tasks, inbox, collaboration)
     - src/content/docs/getting-started/*.mdx   (only if onboarding flow changed)
   → If a feature page is clearly missing for the area (e.g. ticket adds a whole new product surface with no page), create one and add it to astro.config.mjs sidebar.
   → Then ALSO add a changelog entry IF it's user-noteworthy.
B. User-visible bug fix
   → Changelog entry ("Fixed: X"). Update a page only if the fix changed documented behavior.
C. Internal refactor / perf / infra / dev-only
   → Skip entirely. No page, no changelog.
D. Privacy-sensitive (cross-tenant, data leak), test tickets, non-HTPR tickets
   → Skip entirely.

RULES:
1. Read CLAUDE.md in this repo for format, categories, filtering, and style. Follow it exactly.
2. Ticket list JSON: ${TICKETS_FILE}
3. Only HTPR-* tickets.
4. Check src/content/docs/changelog/index.mdx — do not duplicate existing entries.
5. Changelog entries go under today's date heading ("Month Day, Year"), newest at the top.
6. When updating a page, integrate the change into the relevant section — don't append a "recent changes" block. The page should read as if the feature was always there. Match existing voice and structure.
7. For every category-A ticket, you MUST touch at least one page. If you can't decide which page, default to the closest match and note it in the commit message.
8. After changes: \`git add -A\`, \`git commit -m "Docs sync: N pages, M changelog entries (YYYY-MM-DD)"\`, \`git push origin main\`.
9. If nothing worth adding (all tickets are category C/D), do NOT commit. Skip to the RESULT line.

AFTER the push succeeds, for EACH HTPR ticket you touched (page update OR changelog entry), post a comment via the Hypertask CLI. The comment must point primarily at the page that was updated, with the changelog as secondary.

Examples:
- Page-only (category A, not changelog-worthy):
  hypertask comment add HTPR-XXXX --text '<p>📚 Documented on <a href="https://docs.hypertask.ai/cli/reference/">CLI Reference</a>. Stakeholders — please review and reply with corrections or missing context.</p>'
- Page + changelog:
  hypertask comment add HTPR-XXXX --text '<p>📚 Documented on <a href="https://docs.hypertask.ai/cli/reference/">CLI Reference</a> and announced in the <a href="https://docs.hypertask.ai/changelog/">changelog</a>. Please review and reply with corrections.</p>'
- Changelog-only (category B, no page change needed):
  hypertask comment add HTPR-XXXX --text '<p>📚 Logged in the <a href="https://docs.hypertask.ai/changelog/">public changelog</a>. Please review and reply with corrections.</p>'

Hypertask comments MUST be HTML (not Markdown). Do not embed images — use plain anchor tags only.

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
# Build + deploy to Cloudflare Pages (the project has no GitHub integration,
# so pushing alone does not redeploy). Only runs when the commit actually moved.
# ---------------------------------------------------------------------------
DEPLOY_STATUS="skipped"
if [[ "$CHANGED" == "1" && "$SHA_BEFORE" != "$SHA_AFTER" ]]; then
  echo "-- building site"
  if ! npm run build >>"$LOG_FILE" 2>&1; then
    fail "npm run build failed. See $LOG_FILE"
  fi

  echo "-- deploying dist/ to Cloudflare Pages"
  if CLOUDFLARE_ACCOUNT_ID=6031a7dff0d4a6469414cfa8a6dedddf \
     npx --yes wrangler pages deploy dist \
       --project-name hypertask-docs \
       --branch main \
       --commit-hash "$SHA_AFTER" \
       >>"$LOG_FILE" 2>&1; then
    DEPLOY_STATUS="ok"
    echo "-- deploy ok"
    # Purge the CF edge so the changelog page and llms.txt reflect new content immediately
    if [[ -n "${CLOUDFLARE_API_TOKEN:-}" ]]; then
      curl -fsS -X POST \
        "https://api.cloudflare.com/client/v4/zones/2a45a3125cda94f854e5b163392dc76e/purge_cache" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data '{"files":["https://docs.hypertask.ai/","https://docs.hypertask.ai/changelog/","https://docs.hypertask.ai/llms.txt","https://docs.hypertask.ai/llms-full.txt","https://docs.hypertask.ai/llms-small.txt","https://docs.hypertask.ai/changelog.md"]}' \
        >/dev/null && echo "-- cf purge ok" || echo "-- cf purge failed (non-fatal)"
    fi
  else
    DEPLOY_STATUS="failed"
    echo "-- deploy failed (non-fatal for the cron run, commit still pushed)"
    send_telegram "⚠️ <b>HypertaskDocs deploy failed</b>%0Agit push ok but wrangler deploy failed. Log: ${LOG_FILE}"
  fi
fi

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
