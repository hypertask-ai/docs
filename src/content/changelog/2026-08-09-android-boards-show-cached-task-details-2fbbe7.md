---
date: "2026-08-09"
title: "Android boards show cached task details"
tags: ["Board", "Mobile", "Tasks"]
summary: "Android Native Board v0.12 displays saved task metadata without another network request while retaining full-column layouts."
---

Android Native Board v0.12 displays saved task metadata without another network request while retaining full-column layouts.

## Details

Improved: Android Native Board metadata parity in v0.12: cached priority, estimate, due date, labels, assignees, comments, and freshness render without a network enrichment pass, while preserving RecyclerView diffing and full-column layouts (HTPR-5221)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/5221](https://app.hypertask.ai/detail/project-15/5221)
