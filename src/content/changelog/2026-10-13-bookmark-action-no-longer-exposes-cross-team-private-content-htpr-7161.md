---
date: "2026-10-13"
title: "Bookmark action no longer exposes cross-team private content"
tags: ["Security","Tasks"]
summary: "Bookmarking a task no longer lets a logged-in user read another team’s private tasks or comments."
---

Stars and pins on tasks can no longer provide access to another team’s private tasks or comments. Previously, bookmarking a task or commenting on one would provide tokens that allowed an authenticated user to read private data from teams they weren’t on. After this fix, performing a bookmark action or adding a regular comment with a star/pin when viewing a task in one team will no longer expose tokens that read private content from another team. A QA user account outside the QA Team Board attempted to star a task from that board and received “not found” with no content returned, confirming the fix. ([https://app.hypertask.ai/detail/project-15/7161](https://app.hypertask.ai/detail/project-15/7161))

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7161](https://app.hypertask.ai/detail/project-15/7161)
