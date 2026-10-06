---
date: "2026-08-26"
title: "Repeated CLI label flags are kept"
tags: ["CLI", "Tasks"]
summary: "Creating or updating a task with multiple label flags keeps every supplied label."
---

Creating or updating a task with multiple label flags keeps every supplied label.

## Details

Fixed: CLI --labels flags on tasks create and update now accumulate instead of silently dropping earlier flags (HTPR-5703)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/5703](https://app.hypertask.ai/detail/project-15/5703)
