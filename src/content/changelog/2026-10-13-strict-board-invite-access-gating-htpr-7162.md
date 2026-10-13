---
date: "2026-10-13"
title: "Strict board invite access gating"
tags: ["Board","Security"]
summary: "Board invites are now strictly scoped: each invite only adds the signed-in person to the intended board and is refused if used elsewhere or without login.([HTPR-7162](https://app.hypertask.ai/detail/project-15/7162))"
---

Hypertask adds stricter access control around board invites to prevent cross-team and cross-board usage.

When you create an invite to a board:

- An invite is only valid for the board it was generated on.
- The signed-in person must be in the same context as the intended board; an invite for Board A is refused if used on Board B (even if the account has access to both).
- An unauthenticated or anonymous request to use an invite is refused.

This change ensures that sharing via invite remains a scoped, safe mechanism for granting board-level access without exposing team boundaries.

If an invite is used outside its intended context, Hypertask returns a refusal to join, and no unauthorized board addition occurs.

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7162](https://app.hypertask.ai/detail/project-15/7162)
