---
date: "2026-10-14"
title: "AI feedback bot account"
tags: ["AI","Agents"]
summary: "A dedicated \"AI Feedback\" bot account is now used for failed-login reports, keeping user identity out of logs. The account ai-feedback@crolab.org is live and properly configured in production."
---

System notifications about failed sign-in attempts are now filed via a dedicated bot account rather than a personal identity. Changes since claim:

- New account **AI Feedback** ([ai-feedback@crolab.org](mailto:ai-feedback@crolab.org)) is live on production.
- Server accounts and notifications now use this account for failed-login reports.
- Nothing regarding failed-login reports is written as "Valentin".

For security and clarity, failed-login activity is shared with the team through the AI Feedback channel instead of tying directly to individual users:

[https://app.hypertask.ai/detail/project-15/7200](https://app.hypertask.ai/detail/project-15/7200)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7200](https://app.hypertask.ai/detail/project-15/7200)
