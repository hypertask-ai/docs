---
date: "2026-10-14"
title: "AI writes use text compression for Turbopuffer upserts"
tags: ["AI","Search","Boards"]
summary: "AI-generated content for comments and pages is now compressed before upserting, silently rotating text when the embedding service refuses it so content remains searchable with proper tags (HTPR-7212, HTPR-7213, HTPR-7215, HTPR-7216)."
---

AI-generated write to search is built on Turbopuffer embeddings for comments and pages. The underlying embed service can refuse very long or empty text. This change has the embed service reject long/empty text and rotate to a compressed representation before attempting an upsert. During upserts the embed service can still reject, at which point the write silently skips final vector generation, stores compact representation for reprocessing, and upserts without vectors. As a result:

- AI-questions and AI drafts in comments and pages are now searchable with their original tags even when vectors aren’t generated (HTPR-7212).
- Past comment embeddings that failed long/empty rejections are reprocessed, improving retrieval (HTPR-7212).
- Updates to affected page and comment content use the compressed path, avoiding rejections (HTPR-7213, HTPR-7215, HTPR-7216).

This aligns with behavior on Vercel: page upsert and comment upsert skipped when the embed service refused, per https://app.hypertask.ai/detail/project-15/7212.

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7212](https://app.hypertask.ai/detail/project-15/7212)
