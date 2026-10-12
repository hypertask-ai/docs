---
date: "2026-10-12"
title: "Remove agent chat polling flag"
tags: ["Agents"]
summary: "Agent Chat no longer uses a polling flag; status checking is simpler and direct."
---

The feature flag for agent chat polling has been removed from the live system. Agent Chat now uses a straightforward method to check agent status directly. Users experience consistent updates without relying on an internal switch. No functionality is lost; the behavior works as before with more transparent internals.

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7145](https://app.hypertask.ai/detail/project-15/7145)
