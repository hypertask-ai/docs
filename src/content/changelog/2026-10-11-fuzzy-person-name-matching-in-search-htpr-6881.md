---
date: "2026-10-11"
title: "Fuzzy person name matching in search"
tags: ["Search","Tasks"]
summary: "Typed person filters for from: and assignee: now match every person whose name or email contains the text, ignoring case and accents. People picked from the list stay exact match."
---

**Owner+QA preview:** Typed person filters for from: and assignee: now match every person whose name or email contains the text, ignoring case and accents. People picked from the list stay exact match.

When you type a name for `from:` and `assignee:`, it matches every visible person whose name or email contains that text, ignoring case and accents. For example, `from:valentin` finds Valentin Yeo and any account named valentinyeo.

- **Typed filters**: `from:valentin`, `assignee:yc`, and `-from:valentin` treat the name as a substring.
- **Picker filters**: A person selected from the autocomplete list is matched exactly.
- **Flag**: The behavior is behind `<flag:htpr-6881-search-fuzzy-person>` on for Owner and QA accounts only.

Using `dates:`, `label:`, `board:`, `has:`, and `is:` is unaffected. Follow-up to [HTPR-6865](https://app.hypertask.ai/detail/project-15/6865).

<a href="https://app.hypertask.ai/detail/project-15/6881">HTPR-6881</a>

## Related tickets

- [https://app.hypertask.ai/detail/project-15/6881](https://app.hypertask.ai/detail/project-15/6881)
