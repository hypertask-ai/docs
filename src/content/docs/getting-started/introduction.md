---
title: What is Hypertask?
description: An overview of Hypertask - the AI-native project management tool.
---

Hypertask is a project management tool designed for both humans and AI agents to collaborate on software development tasks.

## Why Hypertask?

Traditional project management tools are designed for humans clicking through UIs. Hypertask is different:

- **AI-native** - Built with first-class MCP (Model Context Protocol) support, so AI coding agents can read, create, update, and manage tasks programmatically.
- **Human-friendly** - A clean web UI for managing boards, tasks, and projects without needing the command line.
- **Real-time** - SSE (Server-Sent Events) keep everything in sync across multiple sessions, agents, and team members.

## How it works

Hypertask is organized around a simple hierarchy:

```
Organization
  └── Projects
        └── Boards
              └── Sections (columns)
                    └── Tasks
                          └── Comments
```

- **Projects** group related work (e.g., a product or client).
- **Boards** represent workflows within a project (e.g., "Sprint 1", "Backlog").
- **Sections** are columns on a board (e.g., "Todo", "Doing", "Review", "Done").
- **Tasks** are the units of work, with descriptions, priorities, assignees, and comments.

## Key capabilities

- Create and manage tasks via the web UI or MCP
- Move tasks between sections and boards
- Assign tasks to team members or AI agents
- Add comments with rich HTML content
- Search across all tasks
- Inbox notifications for assigned work
