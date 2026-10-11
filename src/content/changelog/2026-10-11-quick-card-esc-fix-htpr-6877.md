---
date: "2026-10-11"
title: "Quick card Esc fix"
tags: ["Board","Tasks"]
summary: "Pressing Esc to close a quick card now safely closes the box and discards its text without crashing."
---

Before this fix, pressing Escape in the quick card box on a board would crash the app to a "Something went wrong" screen. The text entered in the box would be lost.

After this fix ([HTPR-6877](https://app.hypertask.ai/detail/project-15/6877)), pressing Esc correctly closes the box and leaves it empty, so reopening starts fresh. The fix applies with no flags and works on desktop and mobile, including phones where the discard confirmation appears instead of crashing.

## Related tickets

- [https://app.hypertask.ai/detail/project-15/6877](https://app.hypertask.ai/detail/project-15/6877)
