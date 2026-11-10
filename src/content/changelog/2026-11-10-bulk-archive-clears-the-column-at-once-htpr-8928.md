---
date: "2026-11-10"
title: "Bulk archive clears the column at once"
tags: ["Boards", "Tasks"]
summary: "Selecting a whole column and pressing Ctrl+E now empties it immediately while the tickets archive in the background."
---

Selecting a whole column and pressing Ctrl+E now empties it immediately. The tickets archive in the background, so the column clears in one step instead of one card at a time.

## Details

Improved: Multi-select bulk archive updates the board once, then archives every selected ticket in the background. Tickets that fail to archive return to the board with a message naming them, and Undo still restores everything from the action. Single-ticket archive is unchanged. (HTPR-8928)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/8928](https://app.hypertask.ai/detail/project-15/8928)
