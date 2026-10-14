---
date: "2026-10-14"
title: "Fixed cross-team board column access"
tags: ["Board"]
summary: "Fixed: Only board members can now add columns, not outsider users. (HTPR-7165)"
---

Users can no longer add columns to a board they are not a member of. A security issue regarding cross-team board column access is fixed: only board members are now allowed to add columns. An authorized, signed-in person who is not part of a board’s membership will be refused when attempting to add a column, consistent with restrictions on board invites and access scopes (see HTPR-7162, HTPR-7176). This fix applies to the existing board permission model in all teams.

[https://app.hypertask.ai/detail/project-15/7165](https://app.hypertask.ai/detail/project-15/7165)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7165](https://app.hypertask.ai/detail/project-15/7165)
