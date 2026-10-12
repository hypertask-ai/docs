---
date: "2026-10-12"
title: "Invite link validation"
tags: ["Inbox","Tasks"]
summary: "Pages that generate invite links now validate board context. My Tasks and Inbox no longer fire requests without a board, and invalid requests now show a clear message instead of a console error."
---

When a page generates an invite link, it now checks that a board is selected before sending the request. This change prevents console errors due to unmatched invite link requests on pages like **My Tasks** and **Inbox**, which previously attempted to send four such requests without a board context. As a result, the console stays clean and each invalid request surfaces a clear message, rather than failing with an unhandled server error.

Users now see explicit and helpful feedback when a board is required, improving trustworthiness of invite link actions and reducing developer noise.

**Added** invite link validation on pages that generate or use invite links.

**Improved** console and user feedback for invalid invite link requests.

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7139](https://app.hypertask.ai/detail/project-15/7139)
