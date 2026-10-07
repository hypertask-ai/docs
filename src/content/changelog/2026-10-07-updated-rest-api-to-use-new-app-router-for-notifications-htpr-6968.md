---
date: "2026-10-07"
title: "Updated REST API to use new App Router for notifications"
tags: ["API"]
summary: "Notifications now save through the new App Router and typed writer implementation instead of legacy routes."
---

Notifications now save through the new App Router implementation instead of legacy routes. This builds on the migration started in [HTPR-6968](https://app.hypertask.ai/detail/project-15/6968) and continues to reduce dependency on the old Routes while maintaining compatibility through feature flags.

Writes include:
- Push notifications (fetching, marking as read/unread)
- Archiving and unarchiving notifications

The migration ensures that API operations for notifications use the same typed writer and validation as the updated task, project, and section endpoints under the `flag:api_router_migration` flag. External clients can rely on consistent response shapes and improved reliability for core task workflows ([HTPR-6968](https://app.hypertask.ai/detail/project-15/6968)).

## Related tickets

- [https://app.hypertask.ai/detail/project-15/6968](https://app.hypertask.ai/detail/project-15/6968)
