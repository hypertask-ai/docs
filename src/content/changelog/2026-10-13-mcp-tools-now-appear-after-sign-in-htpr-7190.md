---
date: "2026-10-13"
title: "MCP tools now appear after sign-in"
tags: ["MCP","Agents"]
summary: "Fixed a sign-in bug where strict MCP clients weren't loading tools because the server responded to the wrong address. Both addresses now work correctly."
---

Fix for HTPR-7190: MCP sign-in now properly loads Hypertask tools on both server addresses.

The Hypertask MCP server responds on two URLs. During initial sign-in, it would always name the other address, so strict MCP clients (such as Claude Code) would reject the response, halt connection, and display no available tools. After this fix, clients on both server addresses receive the correct tool listing and can proceed with full functionality.

<a href="https://app.hypertask.ai/detail/project-15/7190">[View HTPR-7190 on Hypertask](https://app.hypertask.ai/detail/project-15/7190)</a>

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7190](https://app.hypertask.ai/detail/project-15/7190)
