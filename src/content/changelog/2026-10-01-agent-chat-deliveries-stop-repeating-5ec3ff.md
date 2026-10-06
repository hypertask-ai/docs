---
date: "2026-10-01"
title: "Agent chat deliveries stop repeating"
tags: ["Agents", "API"]
summary: "Successful webhook chats are no longer marked undelivered, and webhook agents are kept out of the polling queue."
---

Successful webhook chats are no longer marked undelivered, and webhook agents are kept out of the polling queue.

## Details

Fixed: Agent chat webhook deliveries re-queue forever; successful webhook chats are no longer marked undelivered, and webhook agents are excluded from the polling queue (HTPR-6623)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/6623](https://app.hypertask.ai/detail/project-15/6623)
