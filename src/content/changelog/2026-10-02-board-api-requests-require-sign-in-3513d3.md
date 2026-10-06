---
date: "2026-10-02"
title: "Board API requests require sign-in"
tags: ["Board", "API"]
summary: "Logged-out requests cannot read board data or make unauthorized calls through the legacy routes."
---

Logged-out requests cannot read board data or make unauthorized calls through the legacy routes.

## Details

Fixed: Logged-out requests can no longer read board data or make unauthorized API calls; legacy routes now require authenticated sessions (HTPR-6801)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/6801](https://app.hypertask.ai/detail/project-15/6801)
