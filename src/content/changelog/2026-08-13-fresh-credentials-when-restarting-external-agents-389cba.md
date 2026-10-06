---
date: "2026-08-13"
title: "Fresh credentials when restarting external agents"
tags: ["MCP", "Agents", "Infrastructure"]
summary: "Turning external agents back on creates fresh MCP credentials and one-time copyable configurations."
---

Turning external agents back on creates fresh MCP credentials and one-time copyable configurations.

## Details

Added: External agents now mint fresh MCP credentials the first time you turn them back on, returning hasMcpToken: true via detail APIs and showing one-time copyable configurations so the management UI cannot claim an unusable agent is active (HTPR-5406)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/5406](https://app.hypertask.ai/detail/project-15/5406)
