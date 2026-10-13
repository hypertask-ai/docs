---
date: "2026-10-13"
title: "Board and saved-view access security fix"
tags: ["Board","Security"]
summary: "Saved-view endpoints now reject access for users not on the owning board. Cross-board columns, pages, and settings are no longer readable through chat, MCP, or saved views."
---

Board and saved-view endpoints now properly restrict access to boards you’re a member of. Commenters and thread responders may wish to revisit existing board-visibility references to ensure board-scoped behavior is clearly explained. ([HTPR-7166](https://app.hypertask.ai/detail/project-15/7166))

### What’s changed

- **Saved-view access gating** – Requests to saved-view endpoints now check board membership before returning or mutating data. Users not on the board see `404 Not Found` when trying to fetch, rename, delete, or switch to such views.
- **Cross-board data leakage closed** – Column names, settings, and pages from other boards are no longer visible through CLI (`view show / board`, `--tasks`), MCP tools saved-view reads, or board/chat API calls.

### How it works

When a request specifies a saved view, the backend loads that view’s `view_query` payload and resolves which board owns it. If the signed-in session belongs to that board, endpoints proceed; otherwise they return `404 Not Found` rather than leaking partial board metadata or performing side effects. This prevents users from borrowing an invite or leveraging saved-view references to reach boards they do not share.

### Why this matters

- **Stronger security boundaries** – Invites and saved views can no longer indirectly expose cross-board data.
- **Consistent with access semantics** – Saved-view behavior now matches board-readable resource behavior (tasks, tables, pages), which also enforce board-scoped access for anyone signed in.

### Related tickets

- [HTPR-7166](https://app.hypertask.ai/detail/project-15/7166) – Production verification after roll-forward on 2026-10-13.

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7166](https://app.hypertask.ai/detail/project-15/7166)
