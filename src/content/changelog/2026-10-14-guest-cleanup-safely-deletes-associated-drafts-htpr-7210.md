---
date: "2026-10-14"
title: "Guest cleanup safely deletes associated drafts"
tags: ["API","Board"]
summary: "The hourly guest cleanup workflow now safely deletes associated board drafts created by guest users after signing out."
---

< p >The hourly guest cleanup workflow safely deletes associated drafts after a guest signs out, and all times since the fix passed with zero failures. This change expands on existing drafts cleanup to ensure complete cleanup when a guest leaves.</p>

<p>Related<br >/ a href="https://app.hypertask.ai/detail/project-15/7210" [Guest cleanup now safely deletes drafts alongside boards](https://app.hypertask.ai/detail/project-15/7210)</p>

<p>On the docs side,<br >/ a href="https://app.hypertask.ai/detail/project-15/7210" the AI writes use text compression for Turbopuffer upserts</a> covers the search integration with the same fix.</p>

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7210](https://app.hypertask.ai/detail/project-15/7210)
