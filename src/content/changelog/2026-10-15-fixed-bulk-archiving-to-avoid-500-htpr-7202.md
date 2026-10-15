---
date: "2026-10-15"
title: "Fixed bulk archiving to avoid 500"
tags: ["Tasks"]
summary: "Agents attempting to bulk-archive Done tickets now receive a clear \"not allowed\" response instead of a 500 server error."
---

Agents that attempted to bulk-archive Done tickets now receive a clear "not allowed" response instead of a 500 server error. This prevents a crash when an agent tries to archive multiple Done tickets at once while the board enforces the "not allowed" constraint.

FixedEnsure agents receive clean error feedback instead of a crash for bulk archiving validations.

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7202](https://app.hypertask.ai/detail/project-15/7202)
