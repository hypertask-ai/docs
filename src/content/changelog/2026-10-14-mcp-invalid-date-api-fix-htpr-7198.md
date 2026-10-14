---
date: "2026-10-14"
title: "MCP invalid date API fix"
tags: ["MCP","API"]
summary: "Fixed a crash on /api/mcp/tasks when filtering by an invalid date by showing \"invalid date\" instead of crashing. The fix addresses AI clients requesting tickets with non-date values in updated_since filters."
---

When an AI client queried the MCP tasks endpoint with an invalid date string in the `updated_since` filter, the server would crash with an internal error. The API now catches these cases before processing and returns a clear "invalid date" response instead, keeping the session alive. This improves robustness for automated workflows and intelligent co-workers using date-based filtering.

[https://app.hypertask.ai/detail/project-15/7198](https://app.hypertask.ai/detail/project-15/7198)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7198](https://app.hypertask.ai/detail/project-15/7198)
