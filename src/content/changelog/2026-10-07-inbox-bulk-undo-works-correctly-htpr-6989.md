---
date: "2026-10-07"
title: "Inbox bulk undo works correctly"
tags: ["Inbox"]
summary: "Undo after bulk archiving now safely restores all affected items, not just one. Fixed by gracefully skipping empty row slots during undo operations."
---

Undoing inbox items now correctly handles bulk operations. Previously, pressing Ctrl+Z after archiving multiple items using Shift+E would say it worked but leave items in their archived state.

The undo path now gracefully skips empty row slots in the data structure instead of blocking. QAs verified the fix on both QA and normal accounts: archived 3 items at once, pressed Ctrl+Z, and all 3 items came back and stayed after reloading. Undoing a single item still works as expected.

The fix applies to bulk undo via snack bar buttons on desktop and the row's action menu. If an undo doesn't restore an item as expected, it may be located in a separate cluster or split excluded from the undo scope.

Related changes prevent crashes by ensuring the inbox list stays stable when undoing items with irregular row data ([HTPR-6527](https://app.hypertask.ai/detail/project-15/6527)).

## Related tickets

- [https://app.hypertask.ai/detail/project-15/6989](https://app.hypertask.ai/detail/project-15/6989)
