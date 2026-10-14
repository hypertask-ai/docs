---
date: "2026-10-14"
title: "Fixed false AI agent success messages in error logs"
tags: ["AI"]
summary: "AI agent success notes like \"Files attached successfully\" no longer appear in error logs, preventing false error alerts."
---

## What changed

AI agent note logging was too aggressive. All messages, including success notes, were written to the error log stream. As a result, watchers saw repeated "Files attached successfully" entries marked as errors.

## What you’ll notice

Now only actual errors are logged as errors. Success messages such as "Files attached successfully" are no longer confused with problems.

## Impact

Reduced log noise and alert fatigue; error watchers focus on real issues.

[Read the implementation](https://app.hypertask.ai/detail/project-15/7234).

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7234](https://app.hypertask.ai/detail/project-15/7234)
