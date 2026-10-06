---
date: "2026-08-22"
title: "Older live updates cannot overwrite a new task"
tags: ["Tasks", "Settings"]
summary: "Realtime fetches check the subscription and task before applying results, preventing stale responses from overwriting a newly opened task."
---

Realtime fetches check the subscription and task before applying results, preventing stale responses from overwriting a newly opened task.

## Details

Fixed: In-flight realtime fetches validate subscription and task identity before updating open task, preventing older responses from overwriting tasks opened during navigation (HTPR-4833)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/4833](https://app.hypertask.ai/detail/project-15/4833)
