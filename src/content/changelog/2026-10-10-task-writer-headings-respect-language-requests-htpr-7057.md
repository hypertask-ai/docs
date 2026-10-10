---
date: "2026-10-10"
title: "Task Writer headings respect language requests"
tags: ["AI"]
summary: "when you ask Task Writer to write in a specific language, headings and content are now generated in that language (e.g., German headings for German prompts)"
---

The AI Task Writer now respects language requests when you explicitly ask it to write in a particular language. When a prompt includes a language instruction, such as "Please write in German" or a prompt already in German, the assistant applies that language to ticket headings (Problemfeld, Betroffener Bildschirm, Akzeptanzkriterien) and other generated text.

Previously, Task Writer generated headings and descriptions in English even when you requested the content in another language. QA verified that prompts like "Bitte auf Deutsch schreiben: Onboarding Checkliste fuer neue Kunden erstellen" now produce German headings and descriptions. This change applies to both manual drafting and automatic drafts in the New Task flow, giving you consistent output that matches your communication context.

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7057](https://app.hypertask.ai/detail/project-15/7057)
