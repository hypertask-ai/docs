---
date: "2026-08-31"
title: "Protect single-comment requests"
tags: ["Tasks", "API"]
summary: "Logged-out requests to read or update a single comment return a not-found response."
---

Logged-out requests to read or update a single comment return a not-found response.

## Details

Fixed: unauthenticated GET and PUT requests to the single-comment endpoint now return 404 (HTPR-5809)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/5809](https://app.hypertask.ai/detail/project-15/5809)
