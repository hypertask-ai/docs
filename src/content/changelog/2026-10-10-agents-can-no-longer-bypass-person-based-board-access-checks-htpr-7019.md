---
date: "2026-10-10"
title: "Agents can no longer bypass person-based board access checks"
tags: ["Boards","Security"]
summary: "Someone outside a board can no longer read it, and owners, members and agents keep their access."
---

A board reading check previously included agent membership rows when verifying access, meaning a board could inadvertently be visible to users who lack person-level membership but have agent access.

The access check now distinguishes between person and agent membership. Reads from board surfaces verify person membership explicitly; agents are kept separate and only affect write/interaction surfaces per their intended permissions.

As a result, observers with only agent-level access can no longer inspect board content. Owners, board members, and agents with person-level access (as configured) continue to see and interact with the board normally.

[https://app.hypertask.ai/detail/project-15/7019](https://app.hypertask.ai/detail/project-15/7019)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7019](https://app.hypertask.ai/detail/project-15/7019)
