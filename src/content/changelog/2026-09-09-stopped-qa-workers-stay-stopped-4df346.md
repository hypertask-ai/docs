---
date: "2026-09-09"
title: "Stopped QA workers stay stopped"
tags: ["Agents", "Infrastructure"]
summary: "Sol QA workers can be stopped reliably after outside intervention, without the watchdog restarting them."
---

Sol QA workers can be stopped reliably after outside intervention, without the watchdog restarting them.

## Details

Fixed QA worker restarts: Sol QA workers can now be stopped reliably after an external actor intervention, as fleet-watchdog no longer resurrects parked slugs (HTPR-6308)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/6308](https://app.hypertask.ai/detail/project-15/6308)
