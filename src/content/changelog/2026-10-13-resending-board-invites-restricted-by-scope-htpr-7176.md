---
date: "2026-10-13"
title: "Resending board invites restricted by scope"
tags: ["Board","Security"]
summary: "Resending a board invite now works only on the board it was created for."
---

To prevent cross-team data exposure, resending a board invite now validates board context before completing the operation.

What changed:
- An invite can only be resent by the board owner or active members
- Resending outside the original board's context is refused
- Subsequent actions using that invite are also blocked

This ensures each invite remains scoped to its intended board and prevents unauthorized access across team boundaries.

<h3>Related tickets</h3>

- [HTPR-7162](https://app.hypertask.ai/detail/project-15/7162) -- Improve board creation access controls
- [HTPR-7176](https://app.hypertask.ai/detail/project-15/7176) -- Resending invites restricted to board scope

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7176](https://app.hypertask.ai/detail/project-15/7176)
