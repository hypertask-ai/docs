---
date: "2026-10-10"
title: "Chat history and pages load for signed-in users without legacy cookie"
tags: ["Inbox","AI"]
summary: "signed-in users without the older profile cookie now load board, ticket, AI chat, and connection pages correctly instead of hitting silent 401s"
---

Signed-in users without the older profile cookie no longer get silent 401 errors on chat history, pages, custom fields, and other surfaces. Previously, authentication failures for legacy cookies would result in hidden errors for board pages, ticket pages, AI chat, connections, and related features. The app now resolves these requests server-side and renders content for all authorized users regardless of cookie state, eliminating errors on Canva board lists, ticket pages with custom fields, AI chat history, connections, calendar, and velocity report views.

While authenticated users who can access boards normally do not need to take any action, this change ensures that users who had deleted or lost a legacy cookie see complete, usable pages instead of hidden errors. All key surfaces that were affected are now accessible for all sign-in methods.

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7073](https://app.hypertask.ai/detail/project-15/7073)
