---
date: "2026-08-31"
title: "Local storage reads for the native CLI"
tags: ["CLI", "API"]
summary: "The native Zig CLI reads IndexedDB directly, reducing API calls for operations."
---

The native Zig CLI reads IndexedDB directly, reducing API calls for operations.

## Details

Added: CLI now loads IndexedDB directly; the native htz binary compiles in Zig and reads from local storage instead of hitting the API for every operation (HTPR-5771)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/5771](https://app.hypertask.ai/detail/project-15/5771)
