---
title: MCP Tools Reference
description: Complete reference for all Hypertask MCP tools.
---

## hypertask_list_projects

List all projects accessible to the current user.

**Parameters:** None

**Returns:** Array of projects with id, name, and description.

---

## hypertask_list_tasks

List all tasks on a specific board.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `board_id` | number | Yes | The board ID to list tasks from |

---

## hypertask_get_tasks

Get one or more specific tasks by ID.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `task_ids` | number[] | Yes | Array of task IDs to retrieve |

---

## hypertask_create_task

Create a new task on a board.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `board_id` | number | Yes | Board to create the task on |
| `title` | string | Yes | Task title |
| `description` | string | No | HTML description |
| `priority` | string | No | urgent, high, medium, low |

---

## hypertask_update_task

Update an existing task.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `task_id` | number | Yes | Task to update |
| `title` | string | No | New title |
| `description` | string | No | New HTML description |
| `priority` | string | No | New priority |

---

## hypertask_search_tasks

Search across all accessible tasks.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Search query |

---

## hypertask_section

Move a task to a different section on its board.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `task_id` | number | Yes | Task to move |
| `section` | string | Yes | Target section name |

---

## hypertask_move_task_between_boards

Move a task from one board to another.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `task_id` | number | Yes | Task to move |
| `board_id` | number | Yes | Target board ID |

---

## hypertask_assign_user

Assign a user to a task.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `task_id` | number | Yes | Task to assign |
| `user_id` | number | Yes | User to assign |

---

## hypertask_add_comment_to_task

Add a comment to a task. Comments use HTML formatting.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `task_id` | number | Yes | Task to comment on |
| `comment` | string | Yes | HTML comment content |

---

## hypertask_get_comments_for_task

Get all comments on a task.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `task_id` | number | Yes | Task to get comments for |

---

## hypertask_list_project_members

List all members of a project.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_id` | number | Yes | Project to list members for |

---

## hypertask_get_user_context

Get information about the current authenticated user.

**Parameters:** None

---

## hypertask_inbox_list

List all inbox notifications for the current user.

**Parameters:** None

---

## hypertask_inbox_archive

Archive an inbox notification.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `item_id` | number | Yes | Inbox item to archive |
