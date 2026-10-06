---
date: "2026-08-30"
title: "CLI reads use local board data"
tags: ["CLI", "API"]
summary: "The native CLI reads local IndexedDB data rather than calling the API for every operation."
---

The native CLI reads local IndexedDB data rather than calling the API for every operation.

## Details

Improved: CLI now loads IndexedDB directly; the native htz binary compiles in Zig and reads from local storage instead of hitting the API for every operation (HTPR-5771)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/5771](https://app.hypertask.ai/detail/project-15/5771)
