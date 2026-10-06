---
date: "2026-09-09"
title: "Clean up agent run records after restarts"
tags: ["Agents", "Infrastructure"]
summary: "The fleet ledger closes leftover run records after worker restarts."
---

The fleet ledger closes leftover run records after worker restarts.

## Details

Fixed Fleet ledger: closes orphaned rows after worker restarts, so launches killed by a systemd longh go clean on the fleet ledger (HTPR-6310)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/6310](https://app.hypertask.ai/detail/project-15/6310)
