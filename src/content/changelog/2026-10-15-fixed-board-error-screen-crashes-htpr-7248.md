---
date: "2026-10-15"
title: "Fixed board error screen crashes"
tags: ["Board"]
summary: "Fixed the \"Return to previous board\" button crash when landing on an unavailable board screen."
---

The "Return to previous board" button no longer crashes when a user encounters an "This board or ticket is unavailable" screen. Previously, the button would immediately request the user's first board from the server, causing a crash. Now it safely handles the unavailable state and prevents the error.

**Added:** The button now gracefully handles board unavailability scenarios and fails safely.

**Fixed:** Browser crash on board navigation errors.

Reference ticket: [https://app.hypertask.ai/detail/project-15/7248](https://app.hypertask.ai/detail/project-15/7248)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7248](https://app.hypertask.ai/detail/project-15/7248)
