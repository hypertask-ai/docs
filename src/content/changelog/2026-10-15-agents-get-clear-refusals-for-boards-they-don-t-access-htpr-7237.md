---
date: "2026-10-15"
title: "Agents get clear refusals for boards they don’t access"
tags: ["Agents","API"]
summary: "Agents that try to act on a board they don’t belong to receive a clear refusal instead of a 500 server error. Added API response and related docs on board membership."
---

When an agent creates or updates a task on a board it is not a member of, the server now returns a clear error message instead of crashing with a 500 response. Users see:
- "This agent is not a member of this board. Ask the board maintainer to add the agent."
This behavior applies to the `/api/mcp/tasks/create` MCP endpoint and blocks non‑member agents from unassigned or private board operations.
Changes:
- API returns a structured refusal for unauthorized board access.
- Client error messages preserve context so agents can plan next steps (e.g., request board membership).
- Updated MCP tool documentation to describe the new refusal behavior.

This makes agent workflows more reliable and surfaces permission issues directly to the user or integrating system [https://app.hypertask.ai/detail/project-15/7237](https://app.hypertask.ai/detail/project-15/7237).

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7237](https://app.hypertask.ai/detail/project-15/7237)
