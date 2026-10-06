---
date: "2026-08-14"
title: "Clear access errors when resetting views"
tags: ["Board"]
summary: "Resetting a view without access returns a clear error instead of a server failure."
---

Resetting a view without access returns a clear error instead of a server failure.

## Details

Fixed: Reset-to-default for board views now returns an error instead of 500 when the calling user lacks access (HTPR-5362)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/5362](https://app.hypertask.ai/detail/project-15/5362)
