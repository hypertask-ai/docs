---
date: "2026-10-21"
title: "A guided start after agent login"
tags: ["CLI", "MCP", "Agents"]
summary: "Token login now shows who you are signed in as and a board to start with. Hello steps use your advertised MCP tools; read-only agents get no create step."
---

Run `hypertask login --token <token> --human` to see your signed-in identity, the newest board across all boards your token can see, and three commands to try next for write agents. A missing board title falls back to the short name. Read-only agents get two steps, list and playbook, with no create step. For example, Claude Code working for Maria Lopez could start on Product Launch, board 9142.

JSON output keeps `success`, `saved`, and `configPath`. It adds `signedInAs`, `board`, and `nextSteps`. If you can see several boards, a `moreBoards` hint points to `hypertask project list`.

With no board, `--human` says "No board yet. Create one in your Hypertask web app." The CLI waits at most about 1.5 seconds for the guide. On timeout, network or server error, login still saves the token and returns the previous output.

MCP hello and the hello API now include `agent`, `startBoard`, and `nextSteps`: three for write agents, two for read-only agents, or none without a board. The CLI prints the server's steps. Each step has a CLI command and an MCP tool call matching the same credential's `tools/list` catalog.

MCP v2 (consolidated tools, on for Everyone) uses `hypertask_tasks` with `action: "list"` or `"create"`, and `hypertask_projects` with `action: "playbook"`, with board and task fields under `input`. Legacy catalogs keep the old tool names and top-level arguments. MCP clients are asked to introduce the signed-in identity and offer the steps.

See [Connect a new agent](/connect-an-agent/) for an example.

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7519](https://app.hypertask.ai/detail/project-15/7519)
