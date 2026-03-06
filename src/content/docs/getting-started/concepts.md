---
title: Core Concepts
description: Understand the key concepts behind Hypertask.
---

## Projects

A project is the top-level container. It groups related boards and team members. Examples: "Hypertask Product", "Client Website", "Mobile App".

Each project has:
- A name and description
- Team members with roles
- One or more boards

## Boards

Boards are Kanban-style views within a project. Each board contains sections (columns) and tasks.

A project might have multiple boards for different workflows:
- A "Sprint" board for current work
- A "Backlog" board for future work
- A "Bugs" board for issue tracking

## Sections

Sections are the columns on a board. Common patterns:

| Section | Purpose |
|---------|---------|
| Todo | Work not yet started |
| Doing | Actively being worked on |
| Review | Completed, awaiting review |
| Build | Ready to be deployed |
| Done | Shipped and verified |

Tasks move between sections as they progress through the workflow.

## Tasks

Tasks are the core unit of work. Each task has:

- **Title** - Short description of the work
- **Description** - Detailed HTML content explaining what needs to be done
- **Priority** - Urgent, High, Medium, Low
- **Assignee** - Who is responsible (human or AI agent)
- **Section** - Current status/column on the board
- **Comments** - Discussion thread in HTML format

## Comments

Comments are attached to tasks and use HTML formatting. They serve as:
- Discussion between team members
- AI agent status updates
- Review feedback
- Implementation notes

## Inbox

Each user has an inbox that surfaces:
- Tasks assigned to them
- New comments on their tasks
- Tasks moved to their attention

Items can be archived once handled.
