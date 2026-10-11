---
date: "2026-10-11"
title: "Deleted saved views immediately removed from tabs"
tags: ["Board"]
summary: "After deleting a saved view, it leaves the view tabs right away without requiring a page reload."
---

Removing a saved view now clears it from tabs immediately, no page refresh needed. When you delete a view through built-in view management, it disappears from the tabs row and the view list instantly.

Solid regression testing confirms this works regardless of whether you visit a built-in tab first. QUIET passing on Overdue includes visits to built-in splits and direct deletions of saved views; the system consistently removes the view from tabs without a full page reload necessary.

HTPR-7097: https://app.hypertask.ai/detail/project-15/7097

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7097](https://app.hypertask.ai/detail/project-15/7097)
