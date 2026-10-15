---
date: "2026-10-15"
title: "Better Auth origin validation improvements"
tags: ["Infrastructure"]
summary: "Improved validation for Better Auth origins to prevent invalid-origin errors during authentication flows on Vercel."
---

Added stricter origin validation for Better Auth, preventing Invalid Origin errors on Vercel deployments. The adjustment simplifies the origin checking logic during initial login and session establishment. This change reduces noise from invalid origin error logs. Related tickets include [HTPR-7239](https://app.hypertask.ai/detail/project-15/7239) and duplicate fixes [HTPR-7244](https://app.hypertask.ai/detail/project-15/7244) through [HTPR-7247](https://app.hypertask.ai/detail/project-15/7247).</body

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7239](https://app.hypertask.ai/detail/project-15/7239)
