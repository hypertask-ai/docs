##### Hello guided start

The `hypertask_hello` tool and `GET https://mcp.hypertask.ai/api/mcp/hello` return a guided start. In the resource tool interface, call `hypertask_user_context` with `action: "hello"`.

| Field | What it contains |
|-------|------------------|
| `agent` | The agent's `id` and `displayName`. It is `null` for a personal user token. |
| `startBoard` | The newest board the token can see, with `id`, `title`, and `boardUrl`. It is `null` when no board is available. |
| `nextSteps` | Three suggested steps. Each has `step`, a CLI `command`, an MCP `tool`, and MCP `arguments`. |

For the fictional board Product Launch (`9142`), the steps are:

| Step | CLI command | MCP tool | MCP arguments |
|------|-------------|----------|---------------|
| See the board | `hypertask task list --project 9142` | `hypertask_list_tasks` | `{"project_id": 9142}` |
| Create a first task | `hypertask task create --project 9142 --title "My first task"` | `hypertask_create_task` | `{"project_id": 9142, "title": "My first task"}` |
| Read the board rules | `hypertask project playbook 9142` | `hypertask_get_board_playbook` | `{"project_id": 9142}` |

The tool description asks MCP clients to say who they are signed in as and offer these steps. For example: "Signed in as Claude Code (agent of Maria Lopez). Your board is Product Launch. Would you like to see the board, create a first task, or read the board rules?"
