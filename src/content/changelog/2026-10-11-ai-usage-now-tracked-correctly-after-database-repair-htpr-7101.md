---
date: "2026-10-11"
title: "AI usage now tracked correctly after database repair"
tags: ["AI","API"]
summary: "Fixed AI usage count after a database repair. Replies now increment AI usage in real time."
---

After a server-side database repair, a single AI reply on the QA Sandbox board was not immediately reflected in the AI usage page. QA confirmed the issue was resolved: AI replies are again counted in AI usage within 15 seconds, and no new alerts of this kind have appeared. The fix ensures AI-reply-per-minute limits and AI usage tracking continue to work accurately after storage cleanup.

<a href="https://app.hypertask.ai/detail/project-15/7101">HTPR-7101</a>

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7101](https://app.hypertask.ai/detail/project-15/7101)
