---
date: "2026-05-29"
title: "Agent writes show the agent as author"
tags: ["Tasks", "Agents", "Inbox"]
summary: "Tasks and comments made with agent bearer tokens are attributed to the agent rather than its human owner."
---

Tasks and comments made with agent bearer tokens are attributed to the agent rather than its human owner.

## Details

Fixed: Agent bearer tokens now correctly attribute writes to the agent - When an autonomous agent authenticated with its own bearer token created tasks or posted comments, the operations were incorrectly attributed to the agent's human owner. Writes are now correctly attributed to the agent, making activity logs and notifications accurately reflect the agent as the actor. (HTPR-3684)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/3684](https://app.hypertask.ai/detail/project-15/3684)
