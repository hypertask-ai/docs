---
date: "2026-10-02"
title: "Remove description attachments without duplicates"
tags: ["Tasks"]
summary: "Fixed a bug where removing a file from a task description would incorrectly save a duplicate of the remaining file. When you had multiple attachments and removed one, only one copy of each remaining file now persists."
---

When you edited a task description containing file attachments, closing the editor could lead to unexpected behavior. Previously, a bug caused incorrect file handling during attachment removal, where removing one file would result in the other files being duplicated in storage.

The fix ([HTPR-6629](https://app.hypertask.ai/detail/project-339/6629)) ensures that when you open a task, edit the description, remove an attachment you don't want, and save, only the items you deselected are removed. Remaining attachments are preserved as exactly one copy each.

**What you can do now**

- Attach multiple files to a task description (e.g., for a design review or documentation).
- Open the description, click the attachment you want to remove, and save.
- All other attachments persist exactly once, without duplicates.

The change mainly affects the Task Reporter workflow: anyone you've added as a Task Reporter on a task can edit the description and remove attachments without artifacts.

## Related tickets

- [https://app.hypertask.ai/detail/project-15/6629](https://app.hypertask.ai/detail/project-15/6629)
