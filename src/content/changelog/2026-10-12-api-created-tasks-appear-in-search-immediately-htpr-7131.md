---
date: "2026-10-12"
title: "API-created tasks appear in search immediately"
tags: ["Search","API"]
summary: "Tasks created via API or quick-add now show in search pipeline within seconds, without requiring a title edit to index."
---

API-created tasks now appear in search within seconds after creation, without requiring a title rename or edit to trigger indexing. Previously, tickets created through the API or quick-add on a board would not appear in search until their title was saved again.

**How it works:**

The POST /api/v1/tasks endpoint now initiates a search index update after each creation. On desktop and mobile, new tasks indexed via the API or quick-add are discoverable within a few seconds. Background indexing caches result payloads for publisher handles and subjects, reducing redo logic.

**Detected use cases:**

API-created tasks join search results alongside manual creation. Quick-add from boards and fullscreen new-task windows follow the same pattern. Reindexed tasks show title search results consistent with board/card structure and task-type tags.

**Evidence:**

Live test passed on 2026-10-11:
- Ticket made via API found in search after ~6 seconds.
- Quick-add from board found after ~3 seconds.
- Fullscreen new-ticket window found after ~3 seconds.

See [https://app.hypertask.ai/detail/project-15/7131](https://app.hypertask.ai/detail/project-15/7131)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7131](https://app.hypertask.ai/detail/project-15/7131)
