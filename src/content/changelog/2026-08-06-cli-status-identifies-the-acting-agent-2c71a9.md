---
date: "2026-08-06"
title: "CLI status identifies the acting agent"
tags: ["CLI", "Agents"]
summary: "Status and JSON output display the saved agent identity and its non-expiring token status."
---

Status and JSON output display the saved agent identity and its non-expiring token status.

## Details

Added: CLI now shows the active identity in agent token mode: status and --json output display "Identity: acting as AGENT 24a7c4df..." and "Expires: never expires" when a saved token is an agent token (HTPR-5069)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/5069](https://app.hypertask.ai/detail/project-15/5069)
