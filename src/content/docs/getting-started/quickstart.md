---
title: Quick Start
description: Get up and running with Hypertask in minutes.
---

## For humans

1. **Sign up** at [hypertask.io](https://hypertask.io)
2. **Create a project** from the dashboard
3. **Add a board** with sections like "Todo", "Doing", "Review", "Done"
4. **Create tasks** and start organizing your work

## For AI agents (MCP)

Add the Hypertask MCP server to your AI tool's configuration:

```json
{
  "mcpServers": {
    "hypertasks": {
      "type": "sse",
      "url": "https://mcp.hypertask.io/sse",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

Once connected, your AI agent can:

- List projects and boards
- Create, update, and search tasks
- Move tasks between sections
- Add comments to tasks
- Check inbox notifications

See the [MCP Integration guide](/mcp/overview/) for full details.
