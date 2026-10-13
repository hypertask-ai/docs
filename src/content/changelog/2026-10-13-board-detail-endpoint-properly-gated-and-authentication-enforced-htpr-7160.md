---
date: "2026-10-13"
title: "Board detail endpoint properly gated and authentication-enforced"
tags: ["API","Security","Board"]
summary: "A board detail endpoint that anyone could access without login now requires authentication and properly gates board data."
---

A previously reachable board detail endpoint allowed anyone, including users not signed in, to read any board’s tasks and member list through the board address. By accessing the endpoint without authentication, a logged-out caller could inspect tasks and the member directory. After closing this endpoint on the live site, logged-out callers now receive “Unauthorized” and no board data, while logged-in users only see boards they own or belong to. The old endpoint is now gated and no longer leaks cross-board data. ([https://app.hypertask.ai/detail/project-15/7160](https://app.hypertask.ai/detail/project-15/7160))

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7160](https://app.hypertask.ai/detail/project-15/7160)
