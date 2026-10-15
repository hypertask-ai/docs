---
date: "2026-10-15"
title: "Improve error responses for invalid task fields"
tags: ["API","MCP"]
summary: "API now returns 400 for out-of-range values instead of 500 when creating tasks with null descriptions or invalid field data."
---

Hypertask MCP Create Task previously returned a 500 error for null descriptions or out-of-range values. The server now validates inputs and returns a 400 Bad Request with semantic error details instead. This makes failures easier to handle by agents and clients because they can distinguish parameter constraints from server problems.

Related fix: Task create answers 400, not 500, for null description and out-of-range values ([HTPR-7226](https://app.hypertask.ai/detail/project-15/7226)).

<a href="https://app.hypertask.ai/detail/project-15/7230">HTPR-7230</a> | MCP server error remediation.

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7230](https://app.hypertask.ai/detail/project-15/7230)
