---
date: "2026-10-14"
title: "MCP tool listing and task identifier fixes"
tags: ["MCP"]
summary: "Fixed Claude Code MCP tool discovery and clarified how task lookup tools handle ticket numbers."
---

Fixed two MCP interactions affecting Claude Code and AI clients:

1. **MCP tool listing on re-connection**: Some Claude Code users experienced MCP clients that didn't show all Hypertask tools after signing in. The client itself was healthy; the issue was that older versions had a signing/tool-listing flow that didn't refresh the tool catalog. Removing and re-adding the Hypertask connector resolves the issue.

2. **AI client sending ticket numbers as text**: MCP tools that accept task identifiers reject operations where a single ticket number is sent as plain text instead of as a proper identifier. Previously, such unambiguous usage caused log entries marked as server crashes. The server now rejects these cases with clear behavior and no crash.

These fixes improve reliability when agents and workflows interact with Hypertask tasks via MCP.

[https://app.hypertask.ai/detail/project-15/7203](https://app.hypertask.ai/detail/project-15/7203)
[https://app.hypertask.ai/detail/project-15/7205](https://app.hypertask.ai/detail/project-15/7205)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7203](https://app.hypertask.ai/detail/project-15/7203)
