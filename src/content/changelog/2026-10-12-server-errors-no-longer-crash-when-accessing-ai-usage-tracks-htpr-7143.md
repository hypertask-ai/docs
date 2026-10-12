---
date: "2026-10-12"
title: "Server errors no longer crash when accessing AI usage tracks"
tags: ["API","AI"]
summary: "Fixed server errors when AI usage records require a user. Launch verifies AI usage rows have an associated user and uses the owner as the fallback."
---

Previously, Hypertask would throw a server error when launching tasks that generated AI usage but the database didn't associate the usage record with a user. Requests for tasks that used AI would terminate with `Server error: an unexpected error`.

The launch now verifies that each AI usage row includes an associated user. If a user is not present (for example, when generating AI content before a clear owner is set), the launch uses the appropriate owner as the fallback and continues execution instead of failing.

Related tickets: [https://app.hypertask.ai/detail/project-15/7140](https://app.hypertask.ai/detail/project-15/7140)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7143](https://app.hypertask.ai/detail/project-15/7143)
