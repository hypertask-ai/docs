---
date: "2026-09-19"
title: "Bot activity shows the bot's name"
tags: ["CLI", "Tasks"]
summary: "Bot changes are attributed to the bot, not the account owner. CLI activity history shows the same identity."
---

Bot changes are attributed to the bot, not the account owner. CLI activity history shows the same identity.

## Details

Fixed: a bot comment, assignment, move, label change, or blocked-by edit shows the bot name, not the account owner. hypertask comment list --include-activity prints that same bot on the history (HTPR-6516)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/6516](https://app.hypertask.ai/detail/project-15/6516)
