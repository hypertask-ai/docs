---
date: "2026-09-21"
title: "Recover messages from failed webhooks"
tags: ["API"]
summary: "Messages for dead webhooks return to polling. Deleting a webhook releases messages it never acknowledged."
---

Messages for dead webhooks return to polling. Deleting a webhook releases messages it never acknowledged.

## Details

Fixed webhook retries: messages to dead webhooks now return to polling, and deleting a webhook releases any messages it never acknowledged (HTPR-6566)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/6566](https://app.hypertask.ai/detail/project-15/6566)
