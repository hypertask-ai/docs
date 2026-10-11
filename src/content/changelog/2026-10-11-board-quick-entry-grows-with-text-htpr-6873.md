---
date: "2026-10-11"
title: "Board quick entry grows with text"
tags: ["Board"]
summary: "The quick add box on boards now grows up to 8 lines with long card titles, then scrolls so the full text stays visible, matching Trello-style behavior."
---

On Kanban boards and in table view, enter a long task title while using the quick add box at the top or bottom of a column. The box now expands line by line as you type, limiting to a maximum of 8 lines before showing a vertical scroll bar. This keeps the entire title readable while you’re typing, rather than hiding text off to the side.

**Controls:**

- Press Enter to save the card and leave the empty field open for the next title.
- Press Esc to close the box and drop any typed text.
- A quiet "Create task" button and an X are displayed inline so you can complete or cancel the entry without leaving the typing context.

This change applies globally to quick add card boxes on boards (flag htpr-6175-quick-entry-cards) and to the growing behavior itself (flag htpr-6873-quick-entry-grow), which were live on 2026-10-03 and enabled for everyone immediately after QA.

## Related tickets

- [https://app.hypertask.ai/detail/project-15/6873](https://app.hypertask.ai/detail/project-15/6873)
