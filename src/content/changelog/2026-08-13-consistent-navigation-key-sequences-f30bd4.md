---
date: "2026-08-13"
title: "Consistent navigation key sequences"
tags: ["Inbox", "Calendar"]
summary: "Global G shortcuts run before view-specific handlers, so G then I opens Inbox and G then C opens Calendar reliably."
---

Global G shortcuts run before view-specific handlers, so G then I opens Inbox and G then C opens Calendar reliably.

## Details

Added: Global g chords now run in order before surface-specific handlers: g then i from Calendar now correctly navigates to Inbox, and g then c from Inbox correctly navigates to Calendar, preventing conflicts (HTPR-5411)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/5411](https://app.hypertask.ai/detail/project-15/5411)
