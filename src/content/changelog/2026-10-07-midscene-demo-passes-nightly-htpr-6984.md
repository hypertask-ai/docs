---
date: "2026-10-07"
title: "Midscene demo passes nightly"
tags: ["Agents"]
summary: "The demo ticket now passes reliably after waiting for the demo board to be fully ready. Normal run ~18 seconds, fix improves timing."
---

The nightly task-detail-demo now completes successfully. Previously, it would fail after 30 seconds because the demo board creation was taking too long on slower nights. The test now waits up to 30 seconds for the demo board to be ready, which allows a normal run to complete in about 18 seconds.

HTPR-6984: [https://app.hypertask.ai/detail/project-15/6984](https://app.hypertask.ai/detail/project-15/6984)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/6984](https://app.hypertask.ai/detail/project-15/6984)
