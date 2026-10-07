---
date: "2026-10-07"
title: "Task size picker label click returns value"
tags: ["Tasks"]
summary: "Fixed a bug where clicking a size label in the task size picker did nothing and showed an error. Size words now correctly set the task's size."
---

Previously, clicking the words of a size in the Task size picker had no effect and triggered an error. After this fix, clicking a size word now applies that size. Selecting No size clears the size, and clicking other parts of the row continues to work without errors.

This makes the size picker even more reliable for quick sizing in both desktop and mobile experiences.

[https://app.hypertask.ai/detail/project-15/6978](https://app.hypertask.ai/detail/project-15/6978)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/6978](https://app.hypertask.ai/detail/project-15/6978)
