---
date: "2026-10-14"
title: "Task list date filter validation"
tags: ["Tasks"]
summary: "Tasks with invalid dates in board filters will no longer throw server errors. The fix clusters likely invalid date values and shows a clear message instead."
---

When viewing task list filters with invalid dates (including four candidate invalid values such as N/A), the `/api/mcp/tasks` endpoint no longer returns a server error. Hypertask now clusters and validates bad dates inline with a clear error message displayed to users instead, preventing 517 errors while preserving the ability for the user to correct their filter safely. [https://app.hypertask.ai/detail/project-15/7214](https://app.hypertask.ai/detail/project-15/7214)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7214](https://app.hypertask.ai/detail/project-15/7214)
