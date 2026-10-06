---
date: "2026-08-30"
title: "Stronger CLI behavior tests"
tags: ["CLI"]
summary: "CLI tests compare returned data, authentication behavior, and failure cases rather than only exit codes."
---

CLI tests compare returned data, authentication behavior, and failure cases rather than only exit codes.

## Details

Added: CLI parity tests now check JSON diffs, auth matrix, and negative cases instead of exit-code-only checks (HTPR-5783)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/5783](https://app.hypertask.ai/detail/project-15/5783)
