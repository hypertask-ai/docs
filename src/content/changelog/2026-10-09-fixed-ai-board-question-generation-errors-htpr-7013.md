---
date: "2026-10-09"
title: "Fixed AI board question generation errors"
tags: ["AI","Board"]
summary: "AI board questions no longer produce \"No output generated\" errors."
---

AI-generated questions on boards now work reliably across all boards and environments. Before this fix, attempting to generate questions could result in an "No output generated" error under certain conditions, preventing the board from providing useful suggestions.

The issue was isolated to board-level configurations where the AI generation request would fail, possibly due to environment-specific differences or board details that affected the model response. The fix re-sequences and validates the question generation logic to handle these edge cases cleanly, ensuring boards return consistent results for Pro and free plan boards.

Test results confirm that 5 attempts on a Pro test board each return 5 questions in about 2 seconds, with no "No output generated" errors. The fix also works on phone-sized boards, maintaining the same reliability across different view sizes.

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7013](https://app.hypertask.ai/detail/project-15/7013)
