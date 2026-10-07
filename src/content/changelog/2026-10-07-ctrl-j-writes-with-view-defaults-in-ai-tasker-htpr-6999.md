---
date: "2026-10-07"
title: "Ctrl+J writes with view defaults in AI tasker"
tags: ["AI","Board","Tasks"]
summary: "Writing a ticket with Ctrl+J inside a view now applies the view's filters and default properties (labels, assignee, priority, size, column)."
---

When you use the AI Task Writer to create a ticket with Ctrl+J inside a saved view, the new task now automatically adopts the view settings that were applied at the time of creation. This includes labels, assignee, priority, size, and the target column, so the task fits the context of the filtered list from the start.

Previously, a ticket created from a filtered view could land in the wrong section or miss the view-specific properties. Users would sometimes manually adjust these after creation, or the task would get lost behind filters.

With this change, Ctrl+J respects the current view context and writes a ticket that matches the filter set and defaults. The task appears in the correct column and reflects all configuration from the view, with no additional manual steps required.

**How it works:** When the AI Task Writer receives a Ctrl+J event from inside a board view, the system extracts the active filters and view metadata before generating the task draft. The resulting task object includes the same label list, assignee ID, priority, size, and section values so the tool saves directly into the expected location.

**Use case:** You can open a focused view (for example, "High priority urgent tasks in Reporting") and create a new ticket by typing Ctrl+J to start the AI Task Writer. The ticket will instantly appear in that column and inherit all the view's properties, keeping your workflow streamlined and error-free.

<a href="https://app.hypertask.ai/detail/project-15/6999">HTPR-6999</a>

## Related tickets

- [https://app.hypertask.ai/detail/project-15/6999](https://app.hypertask.ai/detail/project-15/6999)
