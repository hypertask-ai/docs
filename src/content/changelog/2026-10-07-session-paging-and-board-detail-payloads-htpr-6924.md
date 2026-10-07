---
date: "2026-10-07"
title: "Session paging and board detail payloads"
tags: ["API","Board"]
summary: "The Sessions rows API uses a stable paging key for session history, and session/board detail responses now include parent and child subtask payloads."
---

New paging behavior for Sessions rows:
- When requesting `?prefer=paged=true`, the API computes deltas from a session history paging key rather than from a historic row snapshot.
- The same paging key applies to selected transcripts via the `.transcripts` endpoint.

Board detail and session detail endpoints also updated:
- Board detail includes parent and child subtask payloads directly in the result.
- Subtask lists for applicable sessions and boards are included in the payload.

This change ensures accurate incremental updates across large session histories and makes relationship handling simpler for clients.

- address: [HTPR-6924](https://app.hypertask.ai/detail/project-15/6924)

- related: [HTPR-6967](https://app.hypertask.ai/detail/project-15/6967)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/6924](https://app.hypertask.ai/detail/project-15/6924)
