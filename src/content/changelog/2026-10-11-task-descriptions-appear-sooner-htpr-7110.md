---
date: "2026-10-11"
title: "Task descriptions appear sooner"
tags: ["Tasks"]
summary: "Writing descriptions in the app now shows them about 2.5 seconds sooner on cold app opens, measured on desktop and mobile."
---

Task description rendering has been optimized for better perceived performance. The change removes an unnecessary wait for the editor, so descriptions written in the app now appear about 2.5 seconds faster during cold app opens on both desktop and mobile.

## What changed

- **Cold start latency:** Users writing tasks on a cold start see their descriptions appear roughly 2.5 seconds sooner (11.7s vs 14.2s, 5 loads each, alternating desktop/mobile with change disabled with `localStorage`).
- **Visual parity:** The description text looks identical before and after the change.

## How it works

The optimization eliminates a synchronous read that was keeping the editor from responding to updates during initial page loads. The edit flow now renders faster and continues with load times consistent across desktop and mobile.

[https://app.hypertask.ai/detail/project-15/7120](https://app.hypertask.ai/detail/project-15/7120)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7110](https://app.hypertask.ai/detail/project-15/7110)
