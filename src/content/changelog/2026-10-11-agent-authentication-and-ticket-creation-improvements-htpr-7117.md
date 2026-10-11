---
date: "2026-10-11"
title: "Agent authentication and ticket creation improvements"
tags: ["Agents","Tasks","Flags"]
summary: "Fixed authentication issues when creating agents via MCP from a person token, improved error messages for invalid columns and labels in ticket creation, and ensured every flag card now shows its real type on the Flags page."
---

### Agents
<a href="https://app.hypertask.ai/detail/project-15/7117">[HTPR-7117](https://app.hypertask.ai/detail/project-15/7117)</a> - Fixed how new agents authenticate and discover connection details. Users can now turn an agent back on and get a fresh MCP credential that works with all connection methods. Authentication scenarios for self-onboarding and set up are clearer for agents stuck trying to configure.

<a href="https://app.hypertask.ai/detail/project-15/7118">[HTPR-7118](https://app.hypertask.ai/detail/project-15/7118)</a> - Enabling person tokens to create agents via MCP when authenticated through their own MCP login. The CLI help and capabilities tools also require login now, and login prompts explain where to obtain a token when one isn't available.

### Tasks
<a href="https://app.hypertask.ai/detail/project-15/7121">[HTPR-7121](https://app.hypertask.ai/detail/project-15/7121)</a> - Fixed vague "Resource not found" errors when an agent creates a ticket with a wrong column or label. The server now provides clear, actionable messages: "Section with ID {id} not found in project {projectId}" and "Label with name '{name}' not found in project {projectId}. Labels given by name work correctly."

### Flags
<a href="https://app.hypertask.ai/detail/project-15/7084">[HTPR-7084](https://app.hypertask.ai/detail/project-15/7084)</a> - Fixed the Flags page to show every flag's real type (Bug, Feature, or Improvement) instead of always showing "Bug". This helps teams quickly understand the flag's purpose and scope at a glance.

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7117](https://app.hypertask.ai/detail/project-15/7117)
