---
date: "2026-09-08"
title: "Keep credentials available for GLM lanes"
tags: ["AI"]
summary: "The GLM environment retains its OpenRouter key so lane quotas work correctly."
---

The GLM environment retains its OpenRouter key so lane quotas work correctly.

## Details

Fixed GLM full-trust: environment no longer strips OPENROUTER_GLM_API_KEY, so squad lane quotas work correctly (HTPR-6252)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/6252](https://app.hypertask.ai/detail/project-15/6252)
