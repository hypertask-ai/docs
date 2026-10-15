---
date: "2026-10-14"
title: "MCP tool keep-alive for SSE connections"
tags: ["API","MCP","AI"]
summary: "Old-style AI tool SSE connections now receive periodic keep-alives and stay open cleanly instead of dropping after a short timeout. Integrated into the hypertask_tasks MCP tool so task queries can proceed without stutter."
---

Old-style AI tool connections use Server-Sent Events (/sse) through the MCP server. Previously, a quiet connection would drop after a short idle period. After this fix, the server sends a small keep-alive heartbeat every 60 seconds to keep the connection alive. The connection then closes cleanly after a primary soft timeout (about 13 minutes). This improved reliability lets agents run schedules with long idle windows without losing connection.

An additional behavior is enforced through the *Hypertask Tasks* MCP tool. Clients that ask for a single task by its number as plain text are now rejected with a clear error. This prevents crashes like the one logged in [HTPR-7205](https://app.hypertask.ai/detail/project-15/7205) and ensures tasks can only be fetched via a ticket identifier (e.g., ``t-123``).

**Updated:** 
- Hypertask Tasks MCP tool now rejects requests with plain text ticket numbers and returns a helpful error message.
- Old-style SSE connections stay open with periodic keep-alives and close cleanly when idle.
- References: [MCP Overview](https://docs.hypertask.ai/mcp/overview/), [MCP workflows](https://docs.hypertask.ai/mcp/workflows/)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7220](https://app.hypertask.ai/detail/project-15/7220)
