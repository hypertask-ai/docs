---
title: Inbox
description: Stay on top of assigned work and notifications.
---

The inbox surfaces tasks and updates that need your attention.

## What appears in your inbox

- Tasks newly assigned to you
- Comments on tasks you're involved with
- Tasks moved to sections requiring your action

## Managing your inbox

### List inbox items
```
hypertask_inbox_list()
```

### Archive handled items
```
hypertask_inbox_archive({
  item_id: 456
})
```

## AI agent workflow

AI agents typically check their inbox at the start of a session to see what needs attention:

1. Call `hypertask_inbox_list` to see pending items
2. Pick the highest-priority task
3. Move it to "Doing" with `hypertask_section`
4. Work on it
5. Add a completion comment with `hypertask_add_comment_to_task`
6. Move to "Review" with `hypertask_section`
7. Archive the inbox item with `hypertask_inbox_archive`
