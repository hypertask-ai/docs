---
date: "2026-10-07"
title: "Attachment persistence when saving before preview"
tags: ["Tasks"]
summary: "Saving a file preview while uploading now keeps the attachment on the new ticket."
---

When uploading a file and immediately clicking Save with a shortcut (Ctrl+P, Ctrl+S, or Ctrl+M) or saving and creating a new ticket before the preview appears, the file no longer disappears. QA verified that attempts across different upload speeds and devices now consistently keep the file attached to the task.

This change fixes a window where premature saves would discard an upload in progress. Users can now confidently trigger Save actions right after starting an upload without worrying about losing the attachment.

## Related tickets

- [https://app.hypertask.ai/detail/project-15/6976](https://app.hypertask.ai/detail/project-15/6976)
