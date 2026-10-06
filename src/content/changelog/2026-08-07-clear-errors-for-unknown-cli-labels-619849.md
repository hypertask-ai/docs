---
date: "2026-08-07"
title: "Clear errors for unknown CLI labels"
tags: ["CLI", "Tasks"]
summary: "Task creation and updates reject unknown labels with a list of valid choices. JSON task details include labels."
---

Task creation and updates reject unknown labels with a list of valid choices. JSON task details include labels.

## Details

Fixed: CLI now validates unknown --labels values on task create/update and fails explicitly with a list of valid labels; tasks get --json also returns the labels field (HTPR-5058)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/5058](https://app.hypertask.ai/detail/project-15/5058)
