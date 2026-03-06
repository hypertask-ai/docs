---
title: MCP Integration
description: How to connect AI agents to Hypertask via the Model Context Protocol.
---

Hypertask provides a full MCP (Model Context Protocol) server that allows AI agents to manage tasks programmatically.

## What is MCP?

The [Model Context Protocol](https://modelcontextprotocol.io/) is an open standard that lets AI models interact with external tools and data sources. Hypertask implements an MCP server that exposes task management operations as tools.

## Connection

Hypertask uses SSE (Server-Sent Events) transport for its MCP server:

```json
{
  "mcpServers": {
    "hypertasks": {
      "type": "sse",
      "url": "https://mcp.hypertask.io/sse",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

## Available tools

| Tool | Description |
|------|-------------|
| `hypertask_list_projects` | List all accessible projects |
| `hypertask_list_tasks` | List tasks on a board |
| `hypertask_get_tasks` | Get specific tasks by ID |
| `hypertask_create_task` | Create a new task |
| `hypertask_update_task` | Update task fields |
| `hypertask_search_tasks` | Search across all tasks |
| `hypertask_section` | Move a task to a section |
| `hypertask_move_task_between_boards` | Move task to another board |
| `hypertask_assign_user` | Assign a user to a task |
| `hypertask_add_comment_to_task` | Add a comment |
| `hypertask_get_comments_for_task` | Read task comments |
| `hypertask_list_project_members` | List team members |
| `hypertask_get_user_context` | Get current user info |
| `hypertask_inbox_list` | Check inbox notifications |
| `hypertask_inbox_archive` | Archive inbox items |

## Supported clients

Hypertask MCP works with any MCP-compatible client:

- **Claude Code** (CLI)
- **Claude Desktop**
- **Cursor**
- **Windsurf**
- **Any MCP-compatible agent**
