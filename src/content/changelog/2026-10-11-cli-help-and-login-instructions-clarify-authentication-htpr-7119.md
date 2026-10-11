---
date: "2026-10-11"
title: "CLI help and login instructions clarify authentication"
tags: ["CLI"]
summary: "Added clarification that CLI help and command listings work without logging in. login now provides clear guidance on obtaining a token."
---

The Hypertask CLI now provides clearer guidance on authentication:

- **Help and capabilities available without login**: Users can run `hypertask --help` and view the full command list even before providing a login token. This matches the design where users should be able to explore capabilities before provisioning an agent.
- **Login success path is explicit**: Attempting to log in when no token is available now displays a helpful message explaining where to obtain a token, instead of failing silently or returning an uninformative error.

These changes make it easier for new users to get started with the CLI by surfacing the help information upfront and guiding them through the process of obtaining a token once they're ready to interact with the platform.

**Related tickets:**
- [HTPR-7119](https://app.hypertask.ai/detail/project-15/7119)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7119](https://app.hypertask.ai/detail/project-15/7119)
