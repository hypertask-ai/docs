---
date: "2026-10-14"
title: "Fixed smart labels parsing"
tags: ["AI","Tasks"]
summary: "Smart labels now correctly parse label lists even when AI returns extra text, fixing cases where short sentences around label lists caused parsing errors."
---

Smart labels now parse label lists reliably even when the AI model returns extra text around the list elements. Previously, some AI responses included descriptive text before or after the list of labels, causing the smart label parser to skip those labels entirely and display errors.

The parser has been updated to extract just the list items, allowing smart labels to classify and assign correctly to all matching tasks. This reduces parsing errors in the logs and gives you more accurate prompt-defined views such as "show me small, quick wins" or "everything touching billing".

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7211](https://app.hypertask.ai/detail/project-15/7211)
