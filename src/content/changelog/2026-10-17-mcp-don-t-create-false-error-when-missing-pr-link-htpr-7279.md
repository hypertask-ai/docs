---
date: "2026-10-17"
title: "MCP: Don't create false error when missing PR link"
tags: ["MCP","Agents"]
summary: "Agents that reference a pull request from a private GitHub repo now receive a warning instead of a false error ticket, avoiding noisy tickets for legitimately missing remote PRs."
---

Before, linking to a non-existent repository sent an error and filed a ticket automatically. After, Hypertask logs a warning when the target repository is not reachable; the original task description includes that warning without automatically creating an error ticket.

Private GitHub repositories are often unavailable to agents. This change prevents cluttered boards with errors for legitimate absent remotes, letting agents handle missing PRs manually or raise appropriate follow-up tasks instead.

How it works:
- When an MCP tool attempts to resolve a PR URL and the repository cannot be found, Hypertask returns an error that the task creator can choose to ignore or treat as actionable.
- A warning is recorded on the task; no automatic ticket creation occurs.
- Agents that rely on PR linking can adjust their workflows to gracefully handle missing remotes (e.g., create a follow-up task to verify the repository visibility or use a different integration).

Related tickets: [HTPR-7279](https://app.hypertask.ai/detail/project-15/7279)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7279](https://app.hypertask.ai/detail/project-15/7279)
