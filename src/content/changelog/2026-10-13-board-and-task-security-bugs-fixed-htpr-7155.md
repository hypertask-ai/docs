---
date: "2026-10-13"
title: "Board and task security bugs fixed"
tags: ["Board","Tasks","Agents"]
summary: "Fixed three bugs that could expose user data or let agents act beyond intended scopes."
---

Added protections that prevent read-only agents from updating task pages; restricted interactive board invites to scope and prevented cross-board data leakage related to tasks. Now deleting a task no longer affects sub-tasks on other boards, and related tasks no longer show titles from boards you’ve lost access to. Board invites can no longer be used to join a different team’s private board, and join requests without login are refused.

- **HTPR-7187**: Deleting a task can no longer delete sub-tasks on another board. Restoring a task from trash now brings back same-board sub-tasks along with the main task.

- **HTPR-7186**: Related tasks no longer display titles from a board you lost access to. The fix prevents cross-board data leakage in the related-tasks display flow.

- **HTPR-7155**: Read-only agents can no longer add, change, archive, or restore task pages. Page actions are now refused to read-only agents, preserving existing page state unchanged.

- **HTPR-7162**: Board invites now only add the signed-in person to the board the invite was created for. Invites intended for one board are refused when attempted on a different team’s board. Join requests without login are refused. See details in [https://app.hypertask.ai/detail/project-15/7162](https://app.hypertask.ai/detail/project-15/7162).

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7155](https://app.hypertask.ai/detail/project-15/7155)
