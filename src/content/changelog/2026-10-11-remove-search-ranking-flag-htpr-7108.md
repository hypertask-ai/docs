---
date: "2026-10-11"
title: "Remove search ranking flag"
tags: ["Search"]
summary: "Search across boards now always places results from the current board first, followed by other boards. Results for tasks with both typed words are now safely hidden."
---

The server-side feature flag `htpr-6372-search-ranking` has been removed. Users no longer see the board-ranking toggle. The search experience is now consistent: all searches rank results from the current board first, then other boards regardless of typed words or filters.

## What changed

- **Board-first results:** In-board tasks always appear at the top of results.
- **Exact-word filters:** The behavior for results that match only one of two typed words was broken; now such results are hidden properly.

## How it works

Client-side `mrp-serving` now uses the simplified ranking logic that always puts the current board first in result order. The fix eliminates the confusion from the removed flag and ensures reliable filtering.

[https://app.hypertask.ai/detail/project-15/7120](https://app.hypertask.ai/detail/project-15/7120)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7108](https://app.hypertask.ai/detail/project-15/7108)
