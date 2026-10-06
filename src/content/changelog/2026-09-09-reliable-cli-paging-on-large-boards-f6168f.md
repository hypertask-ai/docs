---
date: "2026-09-09"
title: "Reliable CLI paging on large boards"
tags: ["Board", "CLI", "Tasks"]
summary: "Paging through large board task lists no longer crashes. Errors are shown clearly instead of silently stopping."
---

Paging through large board task lists no longer crashes. Errors are shown clearly instead of silently stopping.

## Details

Fixed CLI board paging: no longer crashes or segfaults when paginating large boards with tasks list --offset. A clean error message is shown instead of a silent crash mid-page (HTPR-6170)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/6170](https://app.hypertask.ai/detail/project-15/6170)
