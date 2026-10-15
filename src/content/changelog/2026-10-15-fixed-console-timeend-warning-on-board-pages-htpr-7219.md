---
date: "2026-10-15"
title: "Fixed console.timeEnd warning on board pages"
tags: ["Board"]
summary: "Fixed console.timeEnd warning \"No such label 'board'\" on board pages. Verified on production with 0 warnings after deployment, from 3 warnings in the previous 30 minutes."
---

Fixed a Vercel console warning that logged "No such label 'board'" on each board page request. The issue came from a shared debug timer that used the wrong label in console.time and console.timeEnd calls. The board page now uses distinct timers, eliminating the warning and making logs easier to read.

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7219](https://app.hypertask.ai/detail/project-15/7219)
