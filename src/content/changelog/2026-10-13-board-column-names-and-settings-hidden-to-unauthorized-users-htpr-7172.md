---
date: "2026-10-13"
title: "Board column names and settings hidden to unauthorized users"
tags: ["Board"]
summary: "All logged-in users can no longer read another board's column names and settings. Cross-board reads blocked for tasks, pages, and search."
---

Hypertask now enforces strict board membership gating for reading board-level resources, ensuring users only see columns, layout settings, and configuration for boards they are members of. Previously, any signed-in user could read arbitrary column names and settings, including through search filters and tables, creating a potential data discovery issue across unrelated workspaces.

**Users gain:**

- Prevention of cross-board data discovery: unauthorized users cannot enumerate columns or settings on boards they are not on.
- Properly scoped searches and tables: global search, filtered tables, and the search screen only return content accessible to the current user.
- Consistent access semantics: page access follows the task; once a task moves to another board, its pages are restricted to the new board's membership.

**How it works:**

Backend validation now inspects board membership before returning column schemas, column names, layout filters, and board settings for tasks, tables, pages, and saved views. Requests representing cross-board reads receive `404 Not Found` or are filtered to empty results, mirroring the user’s effective board visibility. Write operations (CLI, MCP, REST) continue to be gated separately before mutation.

This security update applies to all surfaces including board detail answers, saved-view actions, and AI‑chat integrations that render table or column data. ([HTPR-7172](https://app.hypertask.ai/detail/project-15/7172))

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7172](https://app.hypertask.ai/detail/project-15/7172)
