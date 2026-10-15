---
date: "2026-10-15"
title: "Fixed AI allowance errors in Vercel logging"
tags: ["AI","Billing"]
summary: "Fixed when teams run out of its AI allowance, users no longer see Allowance Exceeded errors in certain output contexts, instead getting the normal upgrade message."
---

Teams that exceed their included AI allowance no longer see `SharedAiAllowanceExceededError` messages in certain logging contexts. Production verification confirmed A team running out of its AI allowance no longer shows up as an error in the Vercel log, improving the user experience.

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7238](https://app.hypertask.ai/detail/project-15/7238)
