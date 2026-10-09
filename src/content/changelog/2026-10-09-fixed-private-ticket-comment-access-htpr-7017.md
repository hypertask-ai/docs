---
date: "2026-10-09"
title: "Fixed private ticket comment access"
tags: ["Collaboration","Security"]
summary: "Comments on private tickets can no longer be read by users outside the board."
---

Private ticket comments are now strictly visible only to users with access to that board. Before this fix, an outsider could retrieve comment data, comment counts, labels, and private metadata for a private ticket, bypassing board access controls.

The system classifies any request coming from outside a board's membership as unauthorized. An outsider attempting to read comments on a private ticket now receives a "not found" response instead of exposing the comments or their metadata. Board owners and members with valid access continue to see comments and metadata normally.

This security hardening ensures that:
- Any comment posted on a private ticket stays confidential to that board's access scope.
- Count-based metrics (comment counts) do not leak informational data outside the board.
- Private metadata and labels on tickets remain protected by board-level permissions.

The fix was verified on the live site by confirming that an outsider requesting comment data is blocked while owners continue to see their private content.

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7017](https://app.hypertask.ai/detail/project-15/7017)
