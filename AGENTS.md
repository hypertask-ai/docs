# Agents

Method: pstack.

Longer detail is in [CLAUDE.md](CLAUDE.md). This file is the short version. If they disagree, follow the repo: workflows and package.json.

## Board

Help Feedback: https://app.hypertask.ai/project?id=10450

Columns: Ticketed, In Progress, In Review, Done.

Claim before work: assign yourself and move the ticket to In Progress. Move it again only with proof.

## Pull requests

One ticket per PR. Title: `HEFE-n [TYPE] title`. TYPE is DOCS, FIX, or INFRA.

Branch from `origin/main`. Target `main`.

## Checks

Before you open a PR, run:

1. `npm ci`
2. `npm run build` (runs `scripts/check-mdx.mjs`, then `astro build`)
3. `npm run test:mdx`
4. `npm run test:docs`

## Customer docs

How-to pages stay customer-facing. Leave out internal notes, vendor names, API key names, model cost notes, and changelog-style notes.

Verify product claims against the Hypertask app code before you write them.

## Public repo

Commits use a GitHub noreply email, never a real one. No secrets.

## Deploy

Do not deploy by hand. A merge to `main` runs the "Build and Deploy" workflow (`.github/workflows/deploy.yml`). On a push to `main` (changes under `.github/` are ignored) or a manual run, it installs with `npm ci`, runs `npm run build`, uploads `dist` to the Cloudflare Pages project `hypertask-docs`, and purges the edge cache. A failed run opens the GitHub issue "docs.hypertask.ai is not deploying". A later green run closes it.

The help chat does not update on its own. After the deploy is green, run the docs sync (manual only):
`gh workflow run sync-docs.yml -R valentinyeo/ai-chatbot`. No access to that private repo? Ask the Support lead to run it.

Then check help chat answers in `valentinyeo/ai-chatbot` with `npm run replay` (scores `eval/replay-v0.jsonl` against the live help site). replay-v1 does not exist yet (HEFE-78).

## Who merges

The Support lead merges green PRs after an independent verifier posts PASS on the PR.
