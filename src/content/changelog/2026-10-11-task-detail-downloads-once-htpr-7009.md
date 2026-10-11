---
date: "2026-10-11"
title: "Task detail downloads once"
tags: ["Tasks"]
summary: "Opening a ticket now downloads task details once instead of repeatedly, improving speed on both board cards and direct ticket links."
---

Repeated downloads of ticket details when opening a task are now eliminated. QA confirmed that the fix is working as expected: tasks open from the board load their details, comments, and attachments once each instead of two or three times across three consecutive test runs. Both direct card clicks and ticket link navigation benefit from this behavior change, resulting in a noticeably faster and more responsive task detail view.

<a href="https://app.hypertask.ai/detail/project-15/7009">HTPR-7009</a>

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7009](https://app.hypertask.ai/detail/project-15/7009)
