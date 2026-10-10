---
date: "2026-10-10"
title: "Gated downloads for ticket viewers only"
tags: ["Tasks","Security"]
summary: "Only people who can see a ticket can download its files."
---

Downloads were previously reachable for board members without proper task-level visibility because a legacy access check only validated board membership.

The system now attaches a per-ticket access gate to file download paths. A download succeeds only when a user has board membership and task visibility (i.e., can see the ticket). Observers outside the parent task regardless of broader board access receive not found or are blocked.

This change closes a gap where draft task attachments or other files could be retrieved by users who should not see that context including AI-generated previews on private tickets.

[https://app.hypertask.ai/detail/project-15/7018](https://app.hypertask.ai/detail/project-15/7018)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7018](https://app.hypertask.ai/detail/project-15/7018)
