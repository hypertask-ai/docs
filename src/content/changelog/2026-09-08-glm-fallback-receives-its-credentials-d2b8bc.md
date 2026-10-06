---
date: "2026-09-08"
title: "GLM fallback receives its credentials"
tags: ["AI", "Infrastructure"]
summary: "Switching to OpenRouter after a GLM quota limit no longer fails because credentials are missing."
---

Switching to OpenRouter after a GLM quota limit no longer fails because credentials are missing.

## Details

Fixed GLM quota fallback: passes credentials to the OpenRouter provider, preventing HTTP 401 errors on quota switch (HTPR-6248)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/6248](https://app.hypertask.ai/detail/project-15/6248)
