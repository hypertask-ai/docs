---
date: "2026-09-21"
title: "Deployment checks catch existing page errors"
tags: ["Infrastructure"]
summary: "The watchdog and deployment check stop releases when unhandled page-rendering errors are already present in production."
---

The watchdog and deployment check stop releases when unhandled page-rendering errors are already present in production.

## Details

Fixed: Production Watchdog and build deployment gate now blocks any deploy when existing, unhandled hydration errors are present in production (HTPR-6609)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/6609](https://app.hypertask.ai/detail/project-15/6609)
