---
date: "2026-10-14"
title: "Guest cleanup workflow now safely deletes associated drafts"
tags: ["AI","Inbox"]
summary: "Fixed hourly guest cleanup failing when task drafts or AI summaries still existed. Cleanup now removes those records before deleting the task."
---

The hourly guest cleanup workflow previously failed when users had drafts saved to completed tasks, because the task deletion violated a foreign key constraint on existing task drafts and AI summaries. The updated cleanup sequence now removes those records first, ensuring clean deletion of archived guest tasks. This change only affects the internal cleanup process and does not change the user-visible experience other than eliminating occasional failed cleanup runs.

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7209](https://app.hypertask.ai/detail/project-15/7209)
