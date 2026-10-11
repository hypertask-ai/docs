---
date: "2026-10-11"
title: "Fixed Slack thread summaries"
tags: ["Slack","Inbox"]
summary: "Slack thread summaries now reach new threads instead of being stuck on 50 old finished ones."
---

The Slack summary job now continues processing to newer threads that receive ticket mentions. When more than 50 threads with previous summaries exist, the job no longer gets stuck; instead it can process and summarize idle threads that become relevant over time.

On supported threads that mention a ticket (by ID or URL), the bot monitors quiet cycles. A thread is sufficiently idle after more than 30 minutes since the last ticket mention, at which point an AI summary is generated and posted as a comment on that ticket. The summary includes key points and a Slack permalink so the original discussion can be continued there.

This change applies to connected Slack channels and threads where Hypertask is configured to watch for ticket mentions.

[Ticket](https://app.hypertask.ai/detail/project-15/7127)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7127](https://app.hypertask.ai/detail/project-15/7127)
