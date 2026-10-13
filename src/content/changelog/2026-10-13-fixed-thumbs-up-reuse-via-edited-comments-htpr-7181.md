---
date: "2026-10-13"
title: "Fixed thumbs-up reuse via edited comments"
tags: ["Agents"]
summary: "Fixed a security issue where an agent could reuse a thumbs-up on an edited comment to switch feature flags. Thumbs-ups now only count after an edit if the original comment was never edited."
---

An agent can no longer reuse a thumbs-up on an edited comment to switch a different feature flag. A thumbs-up now counts only on comments that were never edited. The verdict check runs in the same step as the flag switch, so no race condition is possible. Users can now trust that flag votes mirror the state of the original comment.

[https://app.hypertask.ai/detail/project-15/7181](https://app.hypertask.ai/detail/project-15/7181)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7181](https://app.hypertask.ai/detail/project-15/7181)
