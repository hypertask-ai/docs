---
date: "2026-10-12"
title: "Fixed AI usage tracking after database repair"
tags: ["AI"]
summary: "AI reply counts now populate correctly after the database repair and no duplicate alerts fire for the same event."
---

After a database repair, a single AI reply wasn’t being counted in AI usage, which triggered duplicate alerts. The fix ensures that usage counters update correctly after the repair and no spurious alerts are raised for completed AI interactions.

Fixes: HTPR-7102

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7102](https://app.hypertask.ai/detail/project-15/7102)
