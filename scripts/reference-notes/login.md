### Guided start after token login

```bash
hypertask login --token <token> --human
```

```text
Signed in as Claude Code (agent of Maria Lopez)
Board: Product Launch
https://app.hypertask.ai/project?id=9142

Next steps your agent can run now:
  1. See the board:          hypertask task list --project 9142
  2. Create a first task:    hypertask task create --project 9142 --title "My first task"
  3. Read the board rules:   hypertask project playbook 9142

Or just ask your agent: "What's on my Hypertask board?"
```

Token login checks the token right away. On success, it shows who you are signed in as and the newest board across all boards the token can see. A missing title falls back to the short name. The example above uses a fictional write agent and board.

The CLI prints the server's steps: read-only agents get two steps, list and playbook, with no create step. If no board is available, `--human` says "No board yet. Create one in your Hypertask web app."

JSON is the default output. It keeps `success`, `saved`, and `configPath`, and adds:

| Field | What it contains |
|-------|------------------|
| `signedInAs` | The signed-in identity, including `name`. |
| `board` | The board's `id`, `title`, and `url`. |
| `nextSteps` | The server's suggested steps (three for write agents, two for read-only agents, none without a board), each with a CLI `command`. |
| `moreBoards` | A hint to run `hypertask project list` when the token can see several boards. |

The CLI waits at most about 1.5 seconds for the guide. If it times out or fails because of a network or server error, login still saves the token. It returns the previous saved-token output without the guided start. Saving a token does not mean the check passed.
