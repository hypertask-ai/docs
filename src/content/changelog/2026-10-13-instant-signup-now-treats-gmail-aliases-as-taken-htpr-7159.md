---
date: "2026-10-13"
title: "Instant signup now treats Gmail aliases as taken"
tags: ["Settings"]
summary: "Instant signup now recognises all Gmail address variants as the same user. A stranger can no longer rename or hijack an existing account via alternate spellings."
---

Before this change, a stranger could copy an existing Gmail address with alternate spellings - like dots, +tags, or googlemail.com - and register a new account with the same identity. This allowed attackers to rename or take over someone else's account.

**What users gained:**
- Quick signup now treats all valid Gmail address forms as the same user - preventing strangers from creating a new identity from the same email.
- Anyone arriving at the signup form sees immediate feedback if the email is already taken.

**What changed on the server:**
- Signup now performs a permissive email lookup using canonicalised Gmail address forms (user@gmail.com, user@gmail.com, user+@gmail.com, and user@gmail.com).
- If any form matches an existing account, signup is blocked and the existing account is surfaced instead.

This fix closes a vector by which an attacker could claim ownership of an existing user's account via alternate Gmail spellings. (Live verification on app.hypertask.ai confirms HTPR-7159.)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7159](https://app.hypertask.ai/detail/project-15/7159)
