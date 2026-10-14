# HypertaskDocs

Documentation site for [Hypertask](https://hypertask.ai) - built with [Astro Starlight](https://starlight.astro.build/).

**Live:** https://docs.hypertask.ai

## How to contribute docs

### File structure

```
src/content/docs/
├── index.mdx                    # Homepage
├── getting-started/
│   ├── introduction.mdx         # What is Hypertask?
│   ├── quickstart.mdx           # Quick Start guide
│   └── concepts.mdx             # Core Concepts
├── features/
│   ├── ai-features.mdx          # AI Features (Task Writer, Dictation, HyperAI)
│   ├── boards.mdx               # Boards & Sections
│   ├── tasks.mdx                # Tasks
│   ├── inbox.mdx                # Inbox & Notifications
│   └── collaboration.mdx        # Collaboration
├── mcp/
│   ├── overview.mdx             # MCP Integration overview
│   └── workflows.mdx            # Agent Workflows
└── api/
    └── tools-reference.mdx      # MCP Tools Reference (15 endpoints)
```

### Writing docs

1. Create or edit `.mdx` files in `src/content/docs/`
2. Every file needs frontmatter:
   ```yaml
   ---
   title: Page Title
   description: Short description for SEO.
   ---
   ```
3. Use Starlight components for rich content:
   ```mdx
   import { Aside, Tabs, TabItem, Steps, Card, CardGrid, LinkCard } from '@astrojs/starlight/components';
   ```
4. If your page uses `import` statements, the file MUST be `.mdx` (not `.md`)
5. Descriptions and code examples should use **HTML** format (matching Hypertask's API)

### Adding a new page

1. Create the `.mdx` file in the appropriate directory
2. Add it to the sidebar in `astro.config.mjs`
3. Open a PR to `main`; merging it deploys (see Deployment below)

### Local development

```bash
npm install
npm run dev     # http://localhost:4321
npm run build   # Build for production
```

### Deployment

Every push to `main` deploys automatically: `.github/workflows/deploy.yml` ("Build and Deploy") runs `npm run build`, uploads `dist` to the Cloudflare Pages project `hypertask-docs` and purges the edge cache. Do not deploy by hand. `build-check.yml` runs the same build on every PR and push.

`npm run build` starts with `scripts/check-mdx.mjs`, which names the file and line of anything that would break the site (bare `{braces}`, unknown components, frontmatter that is not valid YAML, MDX that cannot be parsed). One broken page stops every deploy, so run `npm run build` before you push.

Done means live: after the merge, the "Build and Deploy" run for the merge commit is green and https://docs.hypertask.ai shows the change. A failed deploy opens the GitHub issue "docs.hypertask.ai is not deploying".

## Remote MCP Server (for coworkers)

A Cloudflare Worker at `hypertask-docs-mcp.valentin-603.workers.dev` provides remote MCP access to create/update docs from any Claude Code session.

### Worker location
`workers/docs-mcp/` - deployed as `hypertask-docs-mcp` on the Hypertask Cloudflare account.

### Available tools
| Tool | Description |
|------|-------------|
| `list_pages` | List all doc pages with titles/descriptions |
| `read_page` | Read a page's full MDX content |
| `write_page` | Create or update a page (commits to GitHub) |
| `delete_page` | Delete a page |
| `read_sidebar_config` | Read astro.config.mjs |
| `update_sidebar_config` | Update sidebar config |
| `trigger_deploy` | Trigger Cloudflare Pages rebuild |

### Client config (for coworkers' `.claude/settings.json`)
```json
{
  "mcpServers": {
    "hypertask-docs": {
      "type": "streamablehttp",
      "url": "https://hypertask-docs-mcp.valentin-603.workers.dev/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_HYPERTASK_MCP_TOKEN"
      }
    }
  }
}
```

### Secrets (configured via `wrangler secret put` in `workers/docs-mcp/`)
- `GITHUB_TOKEN` - GitHub PAT with repo write access
- `JWT_SECRET` - Must match Hypertask app's JWT_SECRET from Vercel
- `CF_PAGES_DEPLOY_HOOK` - Cloudflare Pages deploy hook URL

### Pending setup
- Custom domain `docs-mcp.hypertask.ai` needs a Worker Route added (API token lacks zone Workers Route permission - do manually from Cloudflare dashboard)
- `JWT_SECRET` currently set to a temporary value - needs to be updated to match Hypertask app's secret from Vercel

## Changelog

Create one `src/content/changelog/YYYY-MM-DD-short-title.md` (or `.mdx`) file per change.
Use frontmatter `date: "YYYY-MM-DD"`, `title`, `tags: [Board, Search]`, and `summary` (one or two plain sentences).
Write the fuller explanation below the frontmatter using verified facts and full ticket URLs; no index, feed, or sidebar edits are needed.
Run `npm run check:changelog` and `npm run build`; the index, detail page, filters, and feeds are generated automatically.

### Source: Hypertask Product board ONLY
- **Project ID 15** ("Hypertask Product") is the single source of truth
- **ONLY include HTPR-* tickets** - ignore all other ticket prefixes (ANAL-*, BBAB-*, VETS-*, IKNO-*, INNE-*, etc.)
- Query: `hypertask task list --project 15 --section Review` (or API: `projectId=15&sectionName=Review`)

### Content filtering rules
- **No privacy-sensitive content.** Never mention bugs about user data leaking between boards, accounts seeing other accounts' data, users being added to wrong projects, or similar cross-tenant issues. These are internal bugs, not public changelog items.
- **No test tasks.** Skip tickets with titles like "test", "testtask", "test task with rana", etc.
- **No internal bug reports as-is.** Reframe bugs as fixes: "Fixed: X" not "Bug: X was broken"
- **User-facing language only.** Write from the perspective of what users gained, not what was broken internally
- **Categories:** Bug Fixes, Improvements, New Features, Infrastructure (infra only if user-relevant like MCP server, not internal tooling)

### Format
One file represents one change, not a whole day's updates. Use a short plain title, relevant area tags, and a one- or two-sentence summary; expand only verified facts in the body. Link tickets using their full visible URL, for example `[https://app.hypertask.ai/detail/project-15/6977](https://app.hypertask.ai/detail/project-15/6977)`. The index groups entries by month, newest first. RSS is at `/changelog.xml`, and JSON Feed is at `/changelog.json`.

`inventory.json` records the original-source-to-entry migration. `scripts/check-changelog.mjs` independently reads the baseline Git sources and the saved live-page fixture to verify text and ticket preservation. It checks the migrated entries while allowing new entries without inventory changes.

### Telegram notification
After deploying changelog updates, send a Telegram notification that includes:
- A summary of what was added (number of items, categories)
- A **direct link to the changelog page**: `https://docs.hypertask.ai/changelog/`
- If any docs pages were also updated, include their direct links too (e.g. `https://docs.hypertask.ai/features/ai-features/`)

### Style guide

- Dark purple theme matching hypertask.ai
- Technical but approachable tone
- Code examples first, explanations second
- Use tables for parameter lists and comparisons
- Use `<Aside>` for important notes/warnings
- Use `<Tabs>` for multi-client code examples (Claude Desktop, Claude Code, Cursor)
- All API examples use `https://mcp.hypertask.ai` as base URL
- Task descriptions and comments use **HTML**, not Markdown

## Generated pages

Never hand-edit `src/content/docs/api/tools-reference.mdx` or `src/content/docs/cli/commands.mdx`. Run `npm run refs` to regenerate them from live MCP tools and the released CLI. The user timers `docs-refs.timer` (every 30 minutes) and `docs-nightly.timer` (03:30 UTC daily) refresh references and check live exports, links and names. Install later with `scripts/install-docs-timers.sh`; failures log at journal error priority for the error collector to file a ticket.
