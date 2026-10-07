---
date: "2026-10-07"
title: "Typed client slices for chat, writes, and OpenAPI"
tags: ["API","REST"]
summary: "Chat session paging, writes, and OpenAPI now use a typed client behind a feature flag, with full TypeScript types and automatic validation."
---

Chat session paging, writes, and the OpenAPI description now ship behind the `flag:typed_client` switch, using a Zod-generated typed client for selected resources (Owners and QAs). This provides type safety and automatic validation, and the OpenAPI spec is synchronized in real time from the same schemas.

**What you get:**
- Full TypeScript types for chat session paging and write operations.
- Automatic schema validation via Zod, reducing runtime errors.
- Live OpenAPI generation tied to the typed client.

Users with access to the feature can create type-safe clients that mirror the server’s contract, making it easier to build and maintain integrations.

[https://app.hypertask.ai/detail/project-15/6975](https://app.hypertask.ai/detail/project-15/6975)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/6975](https://app.hypertask.ai/detail/project-15/6975)
