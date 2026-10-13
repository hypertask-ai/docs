---
date: "2026-10-13"
title: "Ticket page no longer shifts on mobile"
tags: ["Tasks"]
summary: "The ticket detail page no longer jumps or shifts when first opened on mobile. Comments and controls now appear in place from the initial load on both desktop and phone, with consistent layout across requests."
---

A Content Layout Shift (CLS) regression resurfaced after fix [HTPR-6899](https://app.hypertask.ai/detail/project-15/6899), where the comment box on mobile ticket pages would position itself beneath the task description instead of immediately below the last comment. During page loads, components would settle into place after the initial paint, causing the interface to jitter.

The regression was identified when comment box content would shift down roughly 90‑220 px as comments loaded on long threads. Quick comparisons showed desktop shifts dropping from about 0.018 to 0.007, while mobile was worse.

The fix ensures comment boxes and thread content load in their final position instantly. Valentin's Live QA on 2026‑10‑11 passed 20 of 20 fresh loads on two accounts across desktop and phone; shift scores improved and visual elements now appear as part of cached data instead of settling afterward.

**What users see:**
- Comments open at the bottom of the task, exactly where they were expected to appear after [HTPR-6955](https://app.hypertask.ai/detail/project-15/6955)'s repositioning fix.
- No mid-page spacing around the comment area; the task body remains a stable container.
- Same layout behavior on both desktop and mobile for all test accounts.

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7074](https://app.hypertask.ai/detail/project-15/7074)
