---
date: "2026-10-01"
title: "Block deployments with known page errors"
tags: ["Infrastructure"]
summary: "The production watchdog and deployment check block releases while existing, unhandled page-rendering errors remain."
---

The production watchdog and deployment check block releases while existing, unhandled page-rendering errors remain.

## Details

Fixed: Production Watchdog and build deployment gate now blocks any deploy when existing, unhandled hydration errors are present in production (HTPR-6497) (HTPR-6498) (HTPR-6499) (HTPR-6500) (HTPR-6501) (HTPR-6875)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/6497](https://app.hypertask.ai/detail/project-15/6497)
- [https://app.hypertask.ai/detail/project-15/6498](https://app.hypertask.ai/detail/project-15/6498)
- [https://app.hypertask.ai/detail/project-15/6499](https://app.hypertask.ai/detail/project-15/6499)
- [https://app.hypertask.ai/detail/project-15/6500](https://app.hypertask.ai/detail/project-15/6500)
- [https://app.hypertask.ai/detail/project-15/6501](https://app.hypertask.ai/detail/project-15/6501)
- [https://app.hypertask.ai/detail/project-15/6875](https://app.hypertask.ai/detail/project-15/6875)
