---
date: "2026-09-09"
title: "Task moves work again in production"
tags: ["Tasks", "Infrastructure"]
summary: "Task moves now succeed and reload correctly after the faulty loading check was rolled back."
---

Task moves now succeed and reload correctly after the faulty loading check was rolled back.

## Details

Fixed Task move: succeeds and reloads correctly on production, after a deploy added a loading guard that crashed the moveTask handler and required a rollback (HTPR-6227)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/6227](https://app.hypertask.ai/detail/project-15/6227)
