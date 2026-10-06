---
date: "2026-08-30"
title: "Ownership transfers require authentication"
tags: ["API"]
summary: "The ownership transfer endpoint rejects logged-out requests before making changes."
---

The ownership transfer endpoint rejects logged-out requests before making changes.

## Details

Fixed: account ownership transfer endpoint now returns 401 for unauthenticated requests before state changes (HTPR-5808)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/5808](https://app.hypertask.ai/detail/project-15/5808)
