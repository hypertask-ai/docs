---
date: "2026-10-11"
title: "Fixed brief ticket disappearance when opened from the board on a phone"
tags: ["Mobile","Tasks"]
summary: "On a phone, tickets opened from the board no longer briefly disappear after the fastest Back button configuration."
---

When the faster Back button is enabled, a ticket opened from the board on a phone would briefly blank the screen for 1 to 6 seconds. With the fix, tickets now stay on screen on every open. The issue was caused by a timing check in the navigation logic that failed to account for the faster Back shortcut. QA verified 0 of 30 fresh opens and 0 of 20 repeat opens went blank.

Related issue: [https://app.hypertask.ai/detail/project-15/7116](https://app.hypertask.ai/detail/project-15/7116)
Related feature: [https://app.hypertask.ai/detail/project-15/6991](https://app.hypertask.ai/detail/project-15/6991)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7116](https://app.hypertask.ai/detail/project-15/7116)
