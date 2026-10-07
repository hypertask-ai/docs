---
date: "2026-10-07"
title: "Board scroll now stays in place when going back"
tags: ["Board"]
summary: "Fixed board scroll restoration when returning from search or ticket detail pages."
---

Before this change, navigating away from a board and using the browser Back button or a Back link would reset the board view to the top, forcing you to scroll and re-find your place. Now, the board remembers where you left off and continues from there when returning, matching the expected scroll restoration behavior across search results, ticket detail pages, and browser navigation.

This fix applies to tall boards where scrolling is common, such as detailed project help boards, release notes trackers, or inspection-style Kanban columns.

<a href="https://app.hypertask.ai/detail/project-15/6998">HTPR-6998</a>

## Related tickets

- [https://app.hypertask.ai/detail/project-15/6998](https://app.hypertask.ai/detail/project-15/6998)
