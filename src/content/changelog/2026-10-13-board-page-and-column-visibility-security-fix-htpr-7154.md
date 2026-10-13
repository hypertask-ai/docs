---
date: "2026-10-13"
title: "Board page and column visibility security fix"
tags: ["Board","Security","Pages"]
summary: "Moving a task now follows its pages and tables to other boards, closing pages and columns to users who lack access. Security test showed the fix stops cross-board leaks."
---

Fixed security issues with board page and column visibility. Users work only with tasks, pages, and columns that belong to boards they can actually see. The security tests demonstrated the issue and confirmed the fix works on the live site:

* **Page access follows tasks** – moving a task to another board now moves its associated pages and closes them for users who cannot see the target board.
* **Table and column filtering** – any logged-in user can no longer inspect column names or settings from boards they are not members of. Requests for such data now return `null/Project`
* **Cross-board leaks eliminated** – before, a board member could open test pages or search across any board, exposing additional columns. After the fix, only the user’s own boards satisfy searches and loads; cross-board queries are blocked.

These changes only surface properly filtered content. No API surface or configuration is required, but the permission enforcement now explicitly evaluates board membership for both direct visibility and permission secrets.

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7154](https://app.hypertask.ai/detail/project-15/7154)
