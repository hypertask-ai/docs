---
date: "2026-08-30"
title: "Unknown MCP routes require sign-in"
tags: ["MCP", "API"]
summary: "Unknown MCP API paths require authentication and return an unauthorized response to logged-out requests."
---

Unknown MCP API paths require authentication and return an unauthorized response to logged-out requests.

## Details

Fixed: unknown MCP paths under /api/mcp/* now require authentication and return 401 instead of 404 (HTPR-5769)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/5769](https://app.hypertask.ai/detail/project-15/5769)
