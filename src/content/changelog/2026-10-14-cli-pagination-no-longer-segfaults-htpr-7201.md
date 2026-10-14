---
date: "2026-10-14"
title: "CLI pagination no longer segfaults"
tags: ["CLI"]
summary: "Fixed intermittent crash when paginating CLI tasks list with offset."
---

Paged task listings in the CLI previously crashed intermittently when using `--offset` to walk large collections. The crash resulted from a platform-specific issue on certain architectures where pagination logic exhausted stack limits during large list operations.

The fix ensures stable paginated listing across CLI versions. Affected users should upgrade their CLI installation to the latest version.

**Added:** Stable paginated task listing without crashes.

---

**Resolution details:**
- Ticket: [https://app.hypertask.ai/detail/project-15/7201](https://app.hypertask.ai/detail/project-15/7201)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7201](https://app.hypertask.ai/detail/project-15/7201)
