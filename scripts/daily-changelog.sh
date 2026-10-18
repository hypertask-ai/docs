#!/usr/bin/env bash
# The retired cron's compatibility entrypoint. No LLM, personal login, or direct main push.
# The orchestrator installs the single timer after YPER4-456 G4; do not revive this cron.
set -euo pipefail
exec python3 /home/valentin/projects/growth-bot/scripts/announce_feature.py --daily --publish "$@"
