---
date: "2026-10-13"
title: "Unified MCP endpoint address"
tags: ["MCP"]
summary: "The official MCP endpoint is now mcp.hypertask.ai/mcp across docs, the MCP settings dialog, and the CLI. The app address continues working for signed-in calls for now, but sign-ins are directed to the new address."
---

The official MCP endpoint is now `mcp.hypertask.ai/mcp`, advertised consistently across documentation, the MCP settings dialog, and CLI configuration. This provides a single canonical address for users and agents to discover and connect to Hypertask's MCP server.

When connecting from `mcp.hypertask.ai/mcp`, the server treats each request with a bearer token and ignores session IDs for a limited stateless path (available to Owner and QA users only). Other clients can continue using session-backed transport with WebSocket connections and SSE fallbacks.

The legacy app address (`app.hypertask.ai/mcp`) remains functional for authenticated, signed-in calls for backward compatibility, but new sign-ins are directed to the canonical endpoint. This establishes a clear path forward while maintaining compatibility for existing integrations.

HTPR-7193: <a href="https://app.hypertask.ai/detail/project-15/7193">https://app.hypertask.ai/detail/project-15/7193</a>

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7193](https://app.hypertask.ai/detail/project-15/7193)
