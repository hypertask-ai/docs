---
date: "2026-08-11"
title: "Safe rank updates when tasks are deleted"
tags: ["Tasks"]
summary: "Rank resets no longer return a server error when a task is deleted at the same time."
---

Rank resets no longer return a server error when a task is deleted at the same time.

## Details

Fixed: resetRanks no longer returns 500 when a task is deleted concurrently (HTPR-5310)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/5310](https://app.hypertask.ai/detail/project-15/5310)
