---
date: "2026-10-10"
title: "Fixed: board no longer flashes empty when refusing last-column delete"
tags: ["Board","Tasks"]
summary: "Deleting the last column with cards now shows a helpful message instead of temporarily clearing the board, improving visual stability."
---

When you try to delete the last column on a board that still has cards, Hypertask now shows the message *"This is the board's last column. Move or delete its cards first."* from the column menu. Previously the board could momentarily flash empty during the confirmation process. This change improves visual stability for board deletions.

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7043](https://app.hypertask.ai/detail/project-15/7043)
