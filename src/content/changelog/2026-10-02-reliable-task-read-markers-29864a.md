---
date: "2026-10-02"
title: "Reliable task read markers"
tags: ["Tasks"]
summary: "Marking a task as read no longer fails when requests arrive together or the task was recently deleted."
---

Marking a task as read no longer fails when requests arrive together or the task was recently deleted.

## Details

Fixed: Marking a task as read no longer returns a 500 error when multiple requests arrive together or on recently deleted tasks (HTPR-6821)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/6821](https://app.hypertask.ai/detail/project-15/6821)
