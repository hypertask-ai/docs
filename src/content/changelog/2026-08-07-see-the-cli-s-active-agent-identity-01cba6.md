---
date: "2026-08-07"
title: "See the CLI's active agent identity"
tags: ["CLI", "Agents"]
summary: "CLI status and JSON output show the acting agent identity and that its saved token does not expire."
---

CLI status and JSON output show the acting agent identity and that its saved token does not expire.

## Details

Fixed: CLI now shows the active identity in agent token mode: status and --json output display "Identity: acting as AGENT 24a7c4df..." and "Expires: never expires" when a saved token is an agent token (HTPR-5069)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/5069](https://app.hypertask.ai/detail/project-15/5069)
