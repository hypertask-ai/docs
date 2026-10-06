---
date: "2026-08-21"
title: "Reliable binary lookup for CLI reporting"
tags: ["CLI"]
summary: "The CLI reporter uses absolute binary paths, avoiding launch failures in environments with limited PATH settings."
---

The CLI reporter uses absolute binary paths, avoiding launch failures in environments with limited PATH settings.

## Details

Improved: CLI reporter.mjs now respects absolute path resolution for external binaries when resolving the claude binary, eliminating spawn ENOENT errors caused by bare PATH environments (HTPR-5544)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/5544](https://app.hypertask.ai/detail/project-15/5544)
