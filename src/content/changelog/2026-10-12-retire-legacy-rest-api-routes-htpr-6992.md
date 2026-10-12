---
date: "2026-10-12"
title: "Retire legacy REST API routes"
tags: ["API"]
summary: "Completed migration of tasks, projects, sections, and notifications to the App Router; legacy Routes have been retired."
---

With the `new-structure` flag fully enabled for all users, the old duplicate Routes have been removed. Writes for tasks, projects, sections, and now notifications use the consolidated App Router endpoints exclusively.

All APIs now share a single, maintained implementation. Clients continue to receive the same schemas and response shapes, so existing integrations require no changes.

[https://app.hypertask.ai/detail/project-15/6992](https://app.hypertask.ai/detail/project-15/6992)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/6992](https://app.hypertask.ai/detail/project-15/6992)
