---
date: "2026-10-04"
title: "CLI connections and page loading improvements"
tags: ["Board", "AI", "CLI", "Mobile", "Tasks", "Inbox", "Pages"]
summary: "CLI v0.2.11 reduces repeated connection work while preserving read-command behavior. This update also covers steadier page loading and AI fallback handling."
---

CLI v0.2.11 reduces repeated connection work while preserving read-command behavior. This update also covers steadier page loading and AI fallback handling.

## Details

Added: CLI connectivity improvements in v0.2.11: deduped JSON accessors reduce redundant data fetching, HTTP reachability checks are pooled across commands, and connection allocation is pinned per-request. The release preserves full behavioral parity with v0.2.10 for all read commands, while improving internal efficiency and clarity in how resources are managed. Page loads no longer shift downward for board, inbox, and ticket pages on both desktop and mobile. AI-route fallbacks now report a polite fallback message to users instead of silently failing with generic text. Broken AI requests still preserve the graceful fallback experience, now accompanied by clearer indication that a request failed internally - helping users distinguish failures from normal responses (HTPR-6325)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/6325](https://app.hypertask.ai/detail/project-15/6325)
