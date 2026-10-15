---
date: "2026-10-15"
title: "Eliminated ResizeObserver loop chatter from browser console"
tags: ["Inbox"]
summary: "Fix: Chrome browser no longer logs harmless ResizeObserver warnings on ticket pages; false errors no longer clutter error reports and user activity streams."
---

**Fixed** a browser console issue on ticket pages. Chrome sometimes logs harmless `ResizeObserver loop` warnings when a box on the page resizes itself. Previously these warnings were captured by the client-side error reporter and filed as errors, and they also surfaced in real-time monitoring dashboards. The error tracking no longer tags them as errors, so Sentry error counts don’t inflate and actual errors aren’t obscured.

**What users saw change**
- Cleaner browser console on ticket pages
- Fewer noise events in error reporting and active-user lists
- Real-time overview of ticket activity is less cluttered

**Technical details**
The `ResizeObserver` warning is unrelated to task or board state. The fix filters out these misleading warnings before they’re sent to the error reporting pipeline.

[HTPR-7256](https://app.hypertask.ai/detail/project-15/7256)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7256](https://app.hypertask.ai/detail/project-15/7256)
