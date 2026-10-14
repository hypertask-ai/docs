#!/usr/bin/env bash
# Dedicated automation clone only. Never point this at a developer checkout.
set -euo pipefail
set +x
export PATH="${HOME}/.local/bin:${HOME}/.npm-global/bin:/usr/local/bin:/usr/bin:/bin:${PATH}"
STATE="${HOME}/.local/state/docs-refs"
REPO="${DOCS_REFS_REPO:-${STATE}/repo}"
REMOTE="${DOCS_REFS_REMOTE:-git@github.com:hypertask-ai/docs.git}"
STEP=setup
trap 'status=$?; if (( status != 0 )); then printf "<3>docs-refs failed during %s (exit %s)\n" "$STEP" "$status" >&2; fi' EXIT
mkdir -p "$STATE"
exec 9>"${STATE}/run.lock"
flock -w 1800 9

if [[ "${1:-}" != "--nightly" ]]; then
  STEP=clone
  if [[ ! -e "$REPO" ]]; then
    git clone --branch main --single-branch "$REMOTE" "$REPO"
    touch "$REPO/.git/docs-refs-clone"
  fi
fi
# The marker is created only on a fresh clone; a worktree or arbitrary repo fails closed.
[[ -d "$REPO/.git" && -f "$REPO/.git/docs-refs-clone" ]] || {
  printf '<3>docs-refs requires its dedicated automation clone\n' >&2
  exit 1
}
cd "$REPO"
if [[ "${1:-}" != "--nightly" ]]; then
  STEP=fetch
  git fetch origin main
  git reset --hard origin/main
fi
STEP=dependencies
LOCK_HASH=$(sha256sum package-lock.json | cut -d ' ' -f 1)
if [[ ! -d node_modules || ! -f .git/docs-refs-lock-hash || "$(cat .git/docs-refs-lock-hash)" != "$LOCK_HASH" ]]; then
  npm ci
  printf '%s\n' "$LOCK_HASH" > .git/docs-refs-lock-hash
fi
if [[ "${1:-}" != "--nightly" ]]; then
  STEP=generators
  HYPERTASK_MCP_TOKEN=$(stack-key hypertask HT_ANNOUNCER_AGENT_TOKEN)
  [[ -n "$HYPERTASK_MCP_TOKEN" ]]
  export HYPERTASK_MCP_TOKEN
  npm run refs
  unset HYPERTASK_MCP_TOKEN
fi
STEP=build
npm run build
if [[ "${1:-}" == "--nightly" ]]; then
  STEP=nightly
  node scripts/docs-nightly.mjs
else
  STEP=publish
  FILES=(src/content/docs/api/tools-reference.mdx src/content/docs/cli/commands.mdx)
  if ! git diff --quiet -- "${FILES[@]}" || [[ -n "$(git ls-files --others --exclude-standard -- "${FILES[@]}")" ]]; then
    git add -- "${FILES[@]}"
    git -c user.name="Hypertask docs refs" -c user.email="docs-refs@hypertask.ai" \
      commit -m "docs: refresh generated MCP and CLI references"
    git push origin HEAD:main
  fi
fi
