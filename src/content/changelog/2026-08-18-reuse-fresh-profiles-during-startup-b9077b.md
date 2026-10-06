---
date: "2026-08-18"
title: "Reuse fresh profiles during startup"
tags: ["Tasks"]
summary: "Authentication reuses a cached user profile for up to five minutes, reducing repeated requests."
---

Authentication reuses a cached user profile for up to five minutes, reducing repeated requests.

## Details

Improved: Authentication startup now reuses a fresh cached user profile for up to 5 minutes, reducing refetch load on authenticated loads (HTPR-5450)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/5450](https://app.hypertask.ai/detail/project-15/5450)
