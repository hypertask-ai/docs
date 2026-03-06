---
title: Tasks
description: Creating and managing tasks in Hypertask.
---

Tasks are the core unit of work in Hypertask.

## Task fields

| Field | Type | Description |
|-------|------|-------------|
| Title | string | Short description of the work |
| Description | HTML | Detailed explanation |
| Priority | enum | Urgent, High, Medium, Low |
| Assignee | user | Person or agent responsible |
| Section | reference | Current board column |
| Board | reference | Which board the task belongs to |

## Creating tasks

### Via the web UI
Click "Add task" in any section of your board.

### Via MCP
```
hypertask_create_task({
  board_id: 15,
  title: "Implement user authentication",
  description: "<p>Add login/signup flow</p>",
  priority: "high"
})
```

## Updating tasks

Use `hypertask_update_task` to modify any task field:
```
hypertask_update_task({
  task_id: 1234,
  title: "Updated title",
  priority: "urgent"
})
```

## Searching tasks

Search across all accessible tasks:
```
hypertask_search_tasks({
  query: "authentication"
})
```

## Comments

All task comments use HTML formatting. Add comments to track progress, provide feedback, or document decisions:
```
hypertask_add_comment_to_task({
  task_id: 1234,
  comment: "<p>Implemented the login flow. Ready for review.</p>"
})
```
