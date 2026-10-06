---
date: "2026-09-08"
title: "Agent status stays visible during process exits"
tags: ["Board", "Agents"]
summary: "The Agents dashboard handles processes disappearing during a status scan instead of going blank."
---

The Agents dashboard handles processes disappearing during a status scan instead of going blank.

## Details

Fixed Fleet status page: no longer goes blank when processes exit mid-scan; the agent-runtime collector handles /proc ENOENT race conditions with retries, keeping fleet visibility stable on the Agents dashboard (HTPR-6253)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/6253](https://app.hypertask.ai/detail/project-15/6253)
