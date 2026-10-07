---
date: "2026-10-07"
title: "Fixed inbox at narrow window widths"
tags: ["Inbox"]
summary: "Ticket comments are now always legible at all window sizes. Narrow desktop windows and the mobile desktop site mode no longer push the ticket content to zero width."
---

Comments on tasks are now always readable at every window width, including narrow desktop windows and when you switch the phone view to the desktop site mode.

The issue showed up when a phone or browser that pretends to be desktop connects, and the AI sidebar could squeeze the ticket content to exactly zero width, making comments invisible to the user.

The fix adjusts the layout to prevent content collapse at any width, tested at 390px, 768px, and 1024px with the AI sidebar open and closed. Wide windows now look the same as before, and narrow density wasn't resolved by hiding the AI sidebar alone.

Issue [HTPR-6990](https://app.hypertask.ai/detail/project-15/6990)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/6990](https://app.hypertask.ai/detail/project-15/6990)
