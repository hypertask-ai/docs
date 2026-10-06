---
date: "2026-09-02"
title: "Check trusted CLI versions without blocking workers"
tags: ["CLI", "Agents"]
summary: "The parity check treats non-approved CLI versions as untrusted without blocking workers."
---

The parity check treats non-approved CLI versions as untrusted without blocking workers.

## Details

Fixed Parity gate: validates trusted CLI version; non-approved versions are untrusted and do not block workers (HTPR-6025)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/6025](https://app.hypertask.ai/detail/project-15/6025)
