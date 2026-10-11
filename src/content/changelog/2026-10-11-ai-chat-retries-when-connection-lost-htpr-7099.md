---
date: "2026-10-11"
title: "AI chat retries when connection lost"
tags: ["AI","Agents"]
summary: "AI chat now retries sending when connection drops during prompt submission, and reliably receives answer."
---

Connection drops in AI Chat now work correctly. When the network momentarily fails during message submission, the chat identifies the failure rather than giving up, resubmits the question, and successfully receives response. Applies to desktop and mobile.

The system distinguishes between true connection loss and slow AI response. In failing test runs, typing dots appeared for about 2 seconds after sending, and "Connection lost" came about 6 seconds later -- a brief network blip not a timeout. The fix allows chat to recover gracefully from transient interruptions instead of leaving conversation stalled.

**Expected behavior:** Question sent and answer appears in approximately 2 seconds, even if network hiccups once during request.

HTPR-7099: https://app.hypertask.ai/detail/project-15/7099

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7099](https://app.hypertask.ai/detail/project-15/7099)
