---
date: "2026-10-11"
title: "Fixed rocket-digest agent announcements retrieval"
tags: ["Agents"]
summary: "The rocket-digest agent can now retrieve announcements successfully. A library update had made a dependency incompatible with Vercel."
---

Previously, the rocket-digest agent's announcement retrieval failed with a 500 error on live. A library update on 2026-09-18 brought in an ES module that could not be loaded by the live server on Vercel. The dependency incompatibility caused the announcement admin routes to crash before running, preventing the agent from fetching announcements.

This fix removes the problematic dependency and ensures the rocket-digest agent runs correctly on the live site.

Related: [https://app.hypertask.ai/detail/project-15/7126](https://app.hypertask.ai/detail/project-15/7126)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7126](https://app.hypertask.ai/detail/project-15/7126)
