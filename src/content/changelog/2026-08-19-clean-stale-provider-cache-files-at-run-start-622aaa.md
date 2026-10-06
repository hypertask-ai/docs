---
date: "2026-08-19"
title: "Clean stale provider cache files at run start"
tags: ["Infrastructure"]
summary: "Agent runs remove provider cache files outside the resumable allowlist, avoiding stale credential buildup."
---

Agent runs remove provider cache files outside the resumable allowlist, avoiding stale credential buildup.

## Details

Fixed: Provider-created cache files outside the resumable allowlist are deleted at run start so that provider home directories do not accumulate stale credentials (HTPR-5500)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/5500](https://app.hypertask.ai/detail/project-15/5500)
