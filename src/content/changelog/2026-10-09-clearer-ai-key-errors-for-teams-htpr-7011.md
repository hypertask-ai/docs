---
date: "2026-10-09"
title: "Clearer AI key errors for teams"
tags: ["AI","Agents"]
summary: "When a team lacks an AI Gateway key, the AI task writer now displays a clear message instead of crashing. For owners only, automatic drafting behavior respects ownership settings."
---

When a team has no configured AI key, the AI Task Writer now shows a plain message instead of treating the resulting error as a server crash. Previously, the writer would silently fail or file an internal incident, obscuring the real issue.

This improves troubleshooting for teams relying on AI by surfacing exactly why a write is failing rather than wrapping the error in a generic server error response.

For owners only, the owner-specific feature flag controls visibility of automatic draft descriptions. Owners see AI-generated drafts, while non-owners see a blank prompt and must compose from scratch. The AI writer still captures all user input for manual tasks.

<a href="https://app.hypertask.ai/detail/project-15/7011">HTPR-7011</a>

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7011](https://app.hypertask.ai/detail/project-15/7011)
