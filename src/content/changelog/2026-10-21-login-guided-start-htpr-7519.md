---
date: "2026-10-21"
title: "A guided start after agent login"
tags: ["CLI", "MCP", "Agents"]
summary: "Token login now shows who you are signed in as and a board to start with. MCP hello also offers steps to see the board, create a task, and read the board rules."
---

Run `hypertask login --token <token> --human` to see your signed-in identity, the newest board your token can see, and three commands to try next. For example, Claude Code working for Maria Lopez could start on Product Launch, board 9142. These are fictional examples.

JSON output keeps `success`, `saved`, and `configPath`. It adds `signedInAs`, `board`, and `nextSteps`. If you can see several boards, a `moreBoards` hint points to `hypertask project list`. If the check fails because of a network or server error, login still saves the token and returns the previous output.

The MCP `hypertask_hello` tool and the hello API now include `agent`, `startBoard`, and three `nextSteps`. Each step has a CLI command and an MCP tool call. MCP clients are asked to introduce the signed-in identity and offer the steps.

See [Connect a new agent](/connect-an-agent/) for an example.

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7519](https://app.hypertask.ai/detail/project-15/7519)
