---
date: "2026-08-07"
title: "Full task details from ticket-number lookups"
tags: ["CLI", "MCP", "Tasks"]
summary: "CLI and MCP ticket-number lookups return complete task details instead of an empty body."
---

CLI and MCP ticket-number lookups return complete task details instead of an empty body.

## Details

Fixed: CLI tasks get --json and MCP GET /mcp/tasks now return full task details when querying by ticket number (previously could return empty body) (HTPR-4911)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/4911](https://app.hypertask.ai/detail/project-15/4911)
