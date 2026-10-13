---
date: "2026-10-13"
title: "Fixed task linking restriction in cross-team scenarios"
tags: ["Board","Security"]
summary: "Fixed a security issue where setting a parent task could reveal another team’s task titles when you cannot access that board. Linking tasks across unopenable boards now refuses the operation."
---

Fixed a security issue in which setting a parent task could reveal another team’s task titles when the link was permitted. This occurred when a user attempted to link their task under another team’s task within a board they could not open.

After this fix, attempting to link a task under a task from an inaccessible board now refuses the operation. No changes are saved, and task names from the other board remain hidden.

[View on Hypertask: https://app.hypertask.ai/detail/project-15/7167](https://app.hypertask.ai/detail/project-15/7167)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7167](https://app.hypertask.ai/detail/project-15/7167)
