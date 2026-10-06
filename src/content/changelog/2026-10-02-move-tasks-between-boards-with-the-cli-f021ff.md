---
date: "2026-10-02"
title: "Move tasks between boards with the CLI"
tags: ["Board", "CLI", "Tasks"]
summary: "CLI task moves now work across boards. You can choose the destination board and optionally its column."
---

CLI task moves now work across boards. You can choose the destination board and optionally its column.

## Details

Fixed: CLI bug where task move --to failed cross-board with "Section must belong to same project"; tasks can now be moved to another board with --to &lt;board-id&gt; or --to &lt;board-id&gt; --to-section &lt;section-id&gt; (HTPR-6488) (HTPR-6758) (HTPR-6772)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/6488](https://app.hypertask.ai/detail/project-15/6488)
- [https://app.hypertask.ai/detail/project-15/6758](https://app.hypertask.ai/detail/project-15/6758)
- [https://app.hypertask.ai/detail/project-15/6772](https://app.hypertask.ai/detail/project-15/6772)
