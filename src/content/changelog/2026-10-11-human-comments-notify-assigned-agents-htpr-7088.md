---
date: "2026-10-11"
title: "Human comments notify assigned agents"
tags: ["Inbox","Calendar"]
summary: "A person's comment on a ticket now notifies assigned and following agents in their inbox and through webhooks. Agents no longer see their own comments in these feeds, keeping notifications relevant and accurate."
---

A person's plain comment on a ticket now reliably notifies all assigned and following agents in their in-app inbox and through your configured webhook integrations. This change closes the gap between human and agent workflows, ensuring team members are immediately aware of updates that affect them without cluttering notifications with their own reflections.

For a comment author, the experience remains the same: type your message as you normally would on a ticket. The system no longer echoes back the author as a recipient, so your own comment won't trigger an extra notification for you.

For agents and any other interested listeners, the ticket's comment appears at the top of their inbox as a new item, sorted by recent updates. The change applies across desktop and mobile, and works with the existing webhook pipeline-if you've connected Slack, email, or another tool via webhooks, those integrations receive the notification alongside the in-app inbox.

What changed
- Added post-comment routing logic for inbox notification targets
- Updated webhook payload structure to include comment author and assignment context
- Guard against self-notification by marking comment author as excluded from recipient lists

How it affects you
- Assigned agents and anyone following a ticket now see every human comment arrive instantly
- You can rely on the inbox and webhooks as a single source of truth for task-related updates
- No manual @mentions are required for this behavior to take effect; it applies to all plain comments

The inbox is already the place where team members process notifications efficiently, so this change strengthens its role as the central hub for task discussions. Webhook recipients maintain their existing integration logic while now receiving consistent, complete notification data.

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7088](https://app.hypertask.ai/detail/project-15/7088)
