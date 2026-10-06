---
date: "2026-08-03"
title: "Keep guest boards when signing in"
tags: ["Board"]
summary: "Signing in transfers the guest team, boards, and memberships to the new account while retaining cleanup compatibility."
---

Signing in transfers the guest team, boards, and memberships to the new account while retaining cleanup compatibility.

## Details

Added: Signing in with a guest session now transfers the guest team, its boards, and memberships to the new account, with guest UIDs re-prefixed so that cleanup cron can still find them (HTPR-4893)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/4893](https://app.hypertask.ai/detail/project-15/4893)
