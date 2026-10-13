---
date: "2026-10-13"
title: "Validated login cookies after sign-out"
tags: ["Settings"]
summary: "Copied login cookies no longer work after sign-out. Sessions are now invalidated on logout, closing a security gap where stale cookies kept working."
---

A copied or reused login cookie no longer grants continued access once its owner signs out. The system now properly invalidates cookies and refreshes sessions upon sign-out, preventing attackers from reusing expired credentials.

**What users gained:**
- Logout now fully invalidates login cookies in both the browser and Better Auth sessions on the server.
- A valid sign-out prevents copied, reused, or post-sign-in shares of the original ht_session cookie from granting continued access.

**What changed on the server:**
- Sign-in handlers and legacy routes now always enforce signed ht_session cookie validation.
- Better Auth sessions are refreshed and only associated with the current session ID, ensuring invalidating one sign-out clears all associated credentials.

This fix closes the gap where a session token persisted beyond its intended use after the user signed out. (Live verification on app.hypertask.ai confirms HTPR-7158.)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7158](https://app.hypertask.ai/detail/project-15/7158)
