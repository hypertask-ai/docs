---
date: "2026-08-13"
title: "Render the first mobile board column sooner"
tags: ["Board", "Mobile"]
summary: "Mobile boards initially render only the visible column. The recorded usable time improved by 11% to 3.22 seconds."
---

Mobile boards initially render only the visible column. The recorded usable time improved by 11% to 3.22 seconds.

## Details

Improved: Mobile Boards start by rendering only the first visible column, reducing initial DOM elements and improving usable times to 3.22s (11% faster) on production phones (HTPR-5408)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/5408](https://app.hypertask.ai/detail/project-15/5408)
