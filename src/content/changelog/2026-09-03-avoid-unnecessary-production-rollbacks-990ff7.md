---
date: "2026-09-03"
title: "Avoid unnecessary production rollbacks"
tags: ["Infrastructure"]
summary: "Production auto-rollback no longer fires for the reported failing unit tests, which now pass."
---

Production auto-rollback no longer fires for the reported failing unit tests, which now pass.

## Details

Added Production auto-rollback: stopped firing for red unit tests; both tests now pass on production and the site serves the current build (HTPR-6089)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/6089](https://app.hypertask.ai/detail/project-15/6089)
