---
date: "2026-08-13"
title: "Fewer requests before a mobile board is usable"
tags: ["Board", "Mobile", "API"]
summary: "Secondary requests wait until the board is ready, cutting the measured startup requests from 14 to five."
---

Secondary requests wait until the board is ready, cutting the measured startup requests from 14 to five.

## Details

Improved: Secondary API requests on mobile now wait until the Board is usable before firing, cutting fetch/XHR requests from 14 to 5 per run (64% reduction) for faster perceived startup (HTPR-5409)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/5409](https://app.hypertask.ai/detail/project-15/5409)
