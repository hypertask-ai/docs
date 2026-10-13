---
date: "2026-10-13"
title: "Label permission restriction fixed"
tags: ["Board"]
summary: "Users without board membership can no longer add labels to or modify labels on board tasks they do not belong to. They now receive a \"Forbidden\" error when attempting label modifications."
---

People who are not members of a board can no longer add labels to it or change labels on its tasks. They now get a "Forbidden" response from the server. Board members continue to create, add, and remove labels as before. This prevents unauthorized users from labeling tasks on boards they do not belong to, closing a permission oversight that allowed cross-team label injection [https://app.hypertask.ai/detail/project-15/7177](https://app.hypertask.ai/detail/project-15/7177).

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7177](https://app.hypertask.ai/detail/project-15/7177)
