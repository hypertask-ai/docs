---
date: "2026-10-15"
title: "Fixed timer warnings on board list endpoint"
tags: ["Board"]
summary: "Fixed duplicate timer warnings that appeared when multiple users loaded their boards at once. The server now creates a dedicated timer per board list request, preventing noise in the logs without changing the user experience."
---

Fixed a debug timer in the board list server call that was shared between concurrent requests, causing duplicate timer warnings in the logs. Added a dedicated timer per board list request so each load logs cleanly. This reduces log noise for admins monitoring board loads in production.

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7233](https://app.hypertask.ai/detail/project-15/7233)
