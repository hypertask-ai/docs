##### Hello guided start

Call `hypertask_user_context` with `action: "hello"` for a guided start in MCP v2 (consolidated tools, on for Everyone). The legacy catalog exposes `hypertask_hello`. `GET https://mcp.hypertask.ai/api/mcp/hello` returns the same guide.

| Field | What it contains |
|-------|------------------|
| `agent` | The agent's `id` and `displayName`. It is `null` for a personal user token. |
| `startBoard` | The newest board across all boards the token can see, with `id`, `title`, and `boardUrl`. A missing title falls back to the short name. It is `null` when no board is available. |
| `nextSteps` | Three suggested steps for write agents, or two for read-only agents (no create step). No board means an empty list. Each has `step`, a CLI `command`, an MCP `tool`, and MCP `arguments`. |

Each step uses the tool name and argument shape advertised by `tools/list` for the same credential. For the fictional board Product Launch (`9142`), the default consolidated steps for a write agent are:

| Step | CLI command | MCP tool | MCP arguments |
|------|-------------|----------|---------------|
| See the board | `hypertask task list --project 9142` | `hypertask_tasks` | `{"action":"list","input":{"project_id":9142}}` |
| Create a first task | `hypertask task create --project 9142 --title "My first task"` | `hypertask_tasks` | `{"action":"create","input":{"project_id":9142,"title":"My first task"}}` |
| Read the board rules | `hypertask project playbook 9142` | `hypertask_projects` | `{"action":"playbook","input":{"project_id":9142}}` |

The legacy catalog instead uses `hypertask_list_tasks`, `hypertask_create_task`, and `hypertask_get_board_playbook`, with arguments at the top level (no `action` or `input` wrapper). Read-only agents receive only the list and playbook steps.

The tool description asks MCP clients to say who they are signed in as and offer these steps. For a write agent, for example: "Signed in as Claude Code (agent of Maria Lopez). Your board is Product Launch. Would you like to see the board, create a first task, or read the board rules?"
