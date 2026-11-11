---
date: "2026-11-11"
title: "Page search finds pages with different words"
tags: ["Pages", "Search"]
summary: "Searching pages now uses the same smart search as tickets, so a page comes back even when you describe it in your own words instead of its exact title."
---

Page search used to need the exact words from the page. Typing a description in your own words, such as "the checklist we use before a release", found nothing unless the page happened to contain that phrase.

## Details

Improved: Page search now asks the same search index that already stores every page for its meaning and its words, and mixes both. A page comes back when you describe it differently from how it was written. Results still respect board access, so you only see pages on boards you can open, archived pages stay hidden, and the text you see is the page as it is now, not an old copy. If the index is unavailable, search falls back to the words you typed, exactly as before. (HTPR-9017)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/9017](https://app.hypertask.ai/detail/project-15/9017)
