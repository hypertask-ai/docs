---
date: "2026-10-12"
title: "CLI pages restore version flag now works"
tags: ["CLI"]
summary: "Fixed pages restore --version to restore a specific version ID instead of printing the CLI version."
---

With --version 3427, the previously broken CLI would mistake this for a request to show its own version and fail to restore the specified page version. The fix corrects the flag handling so that a numeric version immediately follows --version and is interpreted as the version ID to restore, not as a version flag.

**Expected behavior:**

```bash
hypertask pages restore --version 3427
# Restores page version 3427 instead of printing the CLI version
```

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7192](https://app.hypertask.ai/detail/project-15/7192)
