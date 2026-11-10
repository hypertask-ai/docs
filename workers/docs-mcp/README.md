# Docs MCP worker release

Release is manual. The explicit read-only hold in
https://app.hypertask.ai/detail/project-4060/623 still applies: writes must
remain disabled. This workflow does not grant approval or offer self-service
approval. The security fix in https://github.com/hypertask-ai/docs/pull/106,
including its safety tests and scripts, is a prerequisite. Do not deploy until
it is merged and reviewed.

Pull requests and pushes to main run packaging checks without deployment
secrets. If the authorization test is absent, those checks can still pass;
release cannot. Checks validate the event checkout (the PR merge commit for
pull requests) and do not mutate the repository. The release runs checks again
on the dispatched main commit, then repeats
safety tests and validates the worker configuration before deployment.

An authorized operator must:

1. Confirm the hold is lifted and record the explicit yes through the existing
   approval process. Confirm the live OAuth configuration is correct and must
   be preserved before approving.
2. Confirm PR #106 is merged, the safety tests pass, and
   `DOCS_EDITOR_USER_IDS` is explicitly empty in `wrangler.toml`.
3. Set the repository variable `DOCS_MCP_APPROVED_SHA` to the approved worker
   content: the full lowercase tree SHA of `workers/docs-mcp`, which the checks
   job prints as `Worker content`. Dispatch **Docs MCP** on main. A missing or
   mismatched value skips release. The full main commit SHA is also accepted,
   but a worker-content value keeps working while only docs pages change; any
   change under `workers/docs-mcp` needs a new value. Dispatch cannot select an
   arbitrary checkout ref.
4. Review the deployment evidence and run live read and write-refusal checks.
   The commit, the worker content and the worker URL appear in the job summary.
   The artifact contains deployment metadata and filtered status output, not
   binding values.

Deployment preserves existing Cloudflare variables with `--keep-vars` and
forces `DOCS_EDITOR_USER_IDS` empty. It does not configure OAuth. Do not use an
unsafe rollback that restores the vulnerable worker or enables writes; follow
the incident process if live checks fail.
