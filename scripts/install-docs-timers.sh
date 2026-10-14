#!/usr/bin/env bash
# Run as valentin after merge. No root or global timers.
set -euo pipefail
[[ "$(id -un)" == valentin ]] || { printf '<3>Run this installer as valentin\n' >&2; exit 1; }
SOURCE=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
REPO="${HOME}/.local/state/docs-refs/repo"
# Bootstrap first: services execute the checked-in script from the dedicated clone.
"${SOURCE}/docs-refresh.sh"
mkdir -p "${HOME}/.config/systemd/user"
cp "${REPO}/scripts/systemd/"docs-{refs,nightly}.{service,timer} "${HOME}/.config/systemd/user/"
systemctl --user daemon-reload
systemctl --user enable --now docs-refs.timer docs-nightly.timer
