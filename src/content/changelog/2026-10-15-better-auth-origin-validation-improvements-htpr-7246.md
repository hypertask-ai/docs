---
date: "2026-10-15"
title: "Better Auth origin validation improvements"
tags: ["API"]
summary: "Fixed invalid-accept-header and invalid-origin verification errors with Better Auth on preview releases by tightening origin validation and stabilizing trust relationships across domains."
---

Fixed invalid-accept-header and invalid-origin verification errors with Better Auth on preview releases by tightening origin validation and stabilizing trust relationships across domains.

- Added explicit-check to reject invalid origins before session establishment; verified against configured allowed origins for better validation.
- Improved trust model between app.hypertask.ai and release subdomains, aligning with stoplist-based configuration; avoided leakage across releases.

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7246](https://app.hypertask.ai/detail/project-15/7246)
