---
date: "2026-10-10"
title: "Better error messages in AI Task Writer"
tags: ["AI"]
summary: "The AI Task Writer now shows plain accounts the real reason when they can't generate drafts, instead of the generic \"try again\" message."
---

For plain accounts that have exhausted their team's AI allowance, the AI Task Writer now displays the exact reason instead of a generic message. This makes it clear whether an upgrade is needed or if there's another issue, so users can take the right action.

Previously, inexperienced users would see only a "try again" message and be unsure about the root cause. Now they see concrete feedback such as "This team has used its included AI allowance for this month. Upgrade now to continue." This applies when auto-drafting is enabled for owners but not rendered for plain accounts.

QA passed on the live site for this change. [https://app.hypertask.ai/detail/project-15/7077](https://app.hypertask.ai/detail/project-15/7077)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7077](https://app.hypertask.ai/detail/project-15/7077)
