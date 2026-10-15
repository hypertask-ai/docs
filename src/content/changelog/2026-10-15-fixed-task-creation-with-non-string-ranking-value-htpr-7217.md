---
date: "2026-10-15"
title: "Fixed task creation with non-string ranking value"
tags: ["Tasks"]
summary: "Creating a task with a numeric ranking parameter now fails with a clear validation message instead of crashing. The ranking field accepts only text values, and integer positions are rejected."
---

Creating a task when the **ranking** parameter is provided as a number now fails with a clear validation message instead of crashing. The ranking field expects a String value; integer numbers are rejected, and only text input is accepted.

This prevents a database ValidationError that previously occurred when the create-task endpoint received an unexpected `Int` value for an endpoint parameter that expects `String`, causing tasks not to be saved.

**What users gain**
- Considerate validation before task creation: invalid numeric rankings are caught and reported clearly, instead of silently failing or crashing.
- A stable API experience: earlier issues where numeric rank values caused non-deterministic task saving are now prevented at the validation layer.

**How it works**
The task creation endpoint validates the `ranking` argument against the endpoint schema, ensuring it is a String before proceeding. Numeric values result in a descriptive error that informs the caller of the expected type.

Wrapped tasks:
- [HTPR-7210](https://app.hypertask.ai/detail/project-15/7210) vercel: turbopuffer comment upsert embedding error, upserting without vectors
- [HTPR-7211](https://app.hypertask.ai/detail/project-15/7211) vercel: turbopuffer comment upsert skipped: embeddings unavailable for &lt;n&gt; row(s)
- [HTPR-7215](https://app.hypertask.ai/detail/project-15/7215) vercel: turbopuffer comment upsert skipped: embeddings unavailable for &lt;n&gt; row(s)
- [HTPR-7216](https://app.hypertask.ai/detail/project-15/7216) vercel: turbopuffer comment upsert embedding error, upserting without vectors

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7217](https://app.hypertask.ai/detail/project-15/7217)
