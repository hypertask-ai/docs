---
date: "2026-10-15"
title: "CLI network-error retries (ReadFailed)"
tags: ["CLI"]
summary: "CLI now retries once on network problems and surfaces the actual error instead of a bare \"ReadFailed\" message."
---

From CLI 0.2.19, when the server does not respond while a command waits, the CLI retries once before reporting the real error. Previously, a dropped connection would result in a generic "ReadFailed" message that gave no information about what went wrong. With this change, users will see the actual network or server error, making it easier to diagnose failures.

This behavior applies broadly to all commands that involve waiting for a server response (task listing, task details, and other read operations). (Read more: [HTPR-7261](https://app.hypertask.ai/detail/project-15/7261), [HTPR-7262](https://app.hypertask.ai/detail/project-15/7262))

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7261](https://app.hypertask.ai/detail/project-15/7261)
