---
date: "2026-08-27"
title: "Reliable task creation with browser state"
tags: ["Tasks"]
summary: "Task creation succeeds with the supplied fields even when browser state contains circular references."
---

Task creation succeeds with the supplied fields even when browser state contains circular references.

## Details

Fixed: ticket creation now succeeds with valid title, description, dates, assignees, labels, URLs, and relations even when browser circular state is present (HTPR-5491)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/5491](https://app.hypertask.ai/detail/project-15/5491)
