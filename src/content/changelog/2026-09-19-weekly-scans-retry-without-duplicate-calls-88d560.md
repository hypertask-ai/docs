---
date: "2026-09-19"
title: "Weekly scans retry without duplicate calls"
tags: ["Agents", "Settings", "Infrastructure"]
summary: "Strix scan failures now retry correctly, and the subscription proxy avoids repeating tool calls across runs."
---

Strix scan failures now retry correctly, and the subscription proxy avoids repeating tool calls across runs.

## Details

Fixed: Weekly Strix scans now retry failures via the fixed proxy and runner, and the subscription proxy no longer duplicates tool calls across runs (HTPR-6598)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/6598](https://app.hypertask.ai/detail/project-15/6598)
