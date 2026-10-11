---
date: "2026-10-11"
title: "CLI inbox no longer treats agent emoji as human"
tags: ["CLI","Inbox"]
summary: "Agent emoji reactions in the inbox are now correctly distinguished from human reactions, and human reactions are no longer dropped by the CLI."
---

The CLI now correctly distinguishes between agent and human reactions when processing inbox data. Previously, the CLI inbox would treat an agent's emoji reactions as if they came from a person, which could lead to incorrect behavior when performing bulk actions or tracking acknowledgments. With this release, agents' emoji reactions are properly identified as coming from agents, and human reactions are no longer dropped when loading inbox data.

The fix affects all CLI inbox operations, including bulk archive and selection actions that count reactions.

[HTPR-7128](https://app.hypertask.ai/detail/project-15/7128)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7128](https://app.hypertask.ai/detail/project-15/7128)
