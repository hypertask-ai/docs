---
date: "2026-10-10"
title: "Fixed: delete last column with cards sends helpful error"
tags: ["Board","Tasks"]
summary: "When deleting the last column with cards, the app now shows a clear message explaining why the deletion cannot proceed, and the column and its cards remain safely in place."
---

Before this fix, attempting to delete a board's final column while it still contained card placeholders silently failed. Users faced confusion because the operation seemed to do nothing and their board state appeared unchanged. After the change, a friendly message *"This is the board's last column. Move or delete its cards first."* appears when trying to delete a column in this state. The column and all associated cards stay intact, allowing users to either clear them out or adjust their board layout before removing the section.

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7040](https://app.hypertask.ai/detail/project-15/7040)
