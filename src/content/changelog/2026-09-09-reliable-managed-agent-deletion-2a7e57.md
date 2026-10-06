---
date: "2026-09-09"
title: "Reliable managed agent deletion"
tags: ["Agents"]
summary: "Deleting managed agents no longer fails with transaction errors. Cleanup checks verify that the fleet can reclaim resources."
---

Deleting managed agents no longer fails with transaction errors. Cleanup checks verify that the fleet can reclaim resources.

## Details

Fixed Managed agent deletion: no longer fails with transaction errors; the cleanup window is extended and a regression assertion verifies reclaimable fleet health (HTPR-6228)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/6228](https://app.hypertask.ai/detail/project-15/6228)
