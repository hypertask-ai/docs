---
date: "2026-10-15"
title: "Fixed ticket page crash on early public-link copy"
tags: ["Tasks","Pages"]
summary: "Fixed crash when copying the public link to a task before the page had finished loading."
---

When a user copies the public link of a ticket before the page had finished loading, the application previously crashed with an unexpected error. The ticket page now safely handles this state and no longer crashes. This clears up disruptions for users who rely on sharing links quickly.

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7259](https://app.hypertask.ai/detail/project-15/7259)
