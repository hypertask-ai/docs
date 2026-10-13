---
date: "2026-10-13"
title: "Shared saved views shown only to accepted members"
tags: ["Board","Security"]
summary: "Saved views shared with a board now appear only to the board owner and members who accepted the invite, fixing unintended access by pending invitees."
---

Board owners can now share saved views with a specific board, but those views now respect board membership more strictly. Before this fix, invited but not-yet-accepted members could see the board and receive saved views triggered on board load, exposing more details than they should. Now, only the board owner and members who have accepted the invite will see the shared saved views. This change closes a security exposure shared by `HTPR-7188` and `HTPR-7187` for similar scenarios. ([https://app.hypertask.ai/detail/project-15/7188](https://app.hypertask.ai/detail/project-15/7188))

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7188](https://app.hypertask.ai/detail/project-15/7188)
