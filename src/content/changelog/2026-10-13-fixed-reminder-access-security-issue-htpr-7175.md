---
date: "2026-10-13"
title: "Fixed reminder access security issue"
tags: ["Inbox","Security"]
summary: "Fixed a security issue where unauthorized users could trigger another person's reminder without logging in. Now only the reminder owner can fire their reminder early."
---

Fixed a security issue where any user could trigger another person's reminder early by sending their reminder details, even without logging in.

After the fix:
- A request with no login is refused and does not modify the reminder
- A logged-in user who sends another person's reminder details is refused
- Only the reminder owner can fire their own "remind me now" button or use the reminder trigger

This change prevents unauthorized access to reminder controls and ensures reminders remain under the owner's control.

[https://app.hypertask.ai/detail/project-15/7175](https://app.hypertask.ai/detail/project-15/7175)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7175](https://app.hypertask.ai/detail/project-15/7175)
