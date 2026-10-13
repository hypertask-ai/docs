---
date: "2026-10-13"
title: "Secure PR updates for board 15"
tags: ["API","Tasks"]
summary: "PR updates on board 15 now require originating from known GitHub accounts, so outsiders cannot link or move tasks from public forks."
---

PR updates in Hypertask can now be linked to tasks and modify them. For board 15, PR updates are accepted only when they come from three whitelisted GitHub accounts. For all other boards, PR updates from any trusted GitHub account are accepted, regardless of repository visibility or forked upstream. This prevents outsiders from linking or moving tasks on board 15 via unauthorized PRs.

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7156](https://app.hypertask.ai/detail/project-15/7156)
