---
title: "AI Feedback from a Bot Account"
description: "Read reports and notifications from an AI Feedback bot account for events like failedlogin logins."
---

import { Card, CardGrid } from '@astrojs/starlight/components';
import { Tabs, TabItem } from '@astrojs/starlight/components';

In Hypertask, events such as failed-login activity can be surfaced through an AI Feedback bot account. This account does not represent your personal identity; instead, it serves as a neutral feedback channel that system notifications can write to.

<Aside type="note">
System-level alerts are no longer written directly to your account. Instead, they use the dedicated bot so clear separation exists between user workflow and event logging.
</Aside>

### What is the AI Feedback bot account?

- **Account:** [ai-feedback@crolab.org](mailto:ai-feedback@crolab.org)
- **Purpose:** File reports like failed-login activity for visibility in the team workspace.
- **Identity:** The account is labeled "AI Feedback". Nothing associated with failed-login events is written as your personal account name.

### Use cases

- **Incident logging:** Failed-login attempts can be recorded as structured reports without exposing user identity.
- **Observability:** Team leads and administrators can monitor security-related events through the bot channel without sifting through individual inboxes.

### How it works

When the server logs failed-login activity, the event is written through the AI Feedback bot. For clarity, users who experience a failed login are not notified about how the report appears; only that the report exists in the workspace. This design keeps user workflows uninterrupted while preserving the event log.

<CardGrid>
  <Card title="Other AI Features" href="/features/ai-features">
    Explore other AI-powered features like task creation, smart labels, and AI agents.
  </Card>
  <Card title="MCP Tools Reference" href="/api/tools-reference">
    Review MCP tools you can use to interact with tasks, boards, and more.
  </Card>
</CardGrid>