---
date: "2026-08-31"
title: "Member removal requires a signed session"
tags: ["API"]
summary: "The member removal endpoint rejects forged identity cookies before deleting a member."
---

The member removal endpoint rejects forged identity cookies before deleting a member.

## Details

Fixed: member removal endpoint now requires a valid signed session; forged identity cookies are rejected before deletion (HTPR-5806)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/5806](https://app.hypertask.ai/detail/project-15/5806)
