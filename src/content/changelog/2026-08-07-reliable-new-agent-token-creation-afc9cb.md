---
date: "2026-08-07"
title: "Reliable new-agent token creation"
tags: ["Agents"]
summary: "The new-agent command no longer crashes on an unescaped quote. Tokens are created and saved reliably."
---

The new-agent command no longer crashes on an unescaped quote. Tokens are created and saved reliably.

## Details

Fixed: ht-agent new crashes due to unescaped quote in embedded Python; token is now minted and saved reliably (HTPR-5048)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/5048](https://app.hypertask.ai/detail/project-15/5048)
