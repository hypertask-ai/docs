---
date: "2026-10-09"
title: "Faster phone board first visit"
tags: ["Board","Performance"]
summary: "Phone boards now show cards in about 1.5 seconds on first visit."
---

The server-drawn first screen optimization improved mobile app performance. Before, opening a phone board took about 9.5 seconds on a first visit; now it takes about 1.5 seconds. Returns are similarly fast at 1.7 seconds. The server renders the initial screen instead of waiting, and the app responds immediately with real card content.

<aside>Server-side rendering of the initial board layout eliminated the round-trip delay and aligns with modern mobile app expectations for near-instant launches.</aside>

The fix was verified on a mobile device with the QA account; card taps and interactions continue to work as expected.

See also [HTPR-6844](https://app.hypertask.ai/detail/project-15/6844), which lazy-loads long board fields only when those UI components are accessed.

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7016](https://app.hypertask.ai/detail/project-15/7016)
