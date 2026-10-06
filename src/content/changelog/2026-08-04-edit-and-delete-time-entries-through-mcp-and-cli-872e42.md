---
date: "2026-08-04"
title: "Edit and delete time entries through MCP and CLI"
tags: ["CLI", "MCP", "API", "Time"]
summary: "MCP and CLI can update existing time entries or delete them by entry ID. Manual time logging remains CLI-only."
---

MCP and CLI can update existing time entries or delete them by entry ID. Manual time logging remains CLI-only.

## Details

Added: MCP and CLI can now update existing time entries via POST /api/mcp/time/update (HTTP 400 if neither minutes nor date is provided), and POST /api/mcp/time/delete via entry_id; no separate /api/mcp/time/log delete action exists, and hypertask_time log remains CLI-only for manual entry (HTPR-4725)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/4725](https://app.hypertask.ai/detail/project-15/4725)
