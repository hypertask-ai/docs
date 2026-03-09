# HypertaskDocs

Documentation site for [Hypertask](https://hypertask.ai) — built with [Astro Starlight](https://starlight.astro.build/).

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
3. Push to `main` — Cloudflare Pages auto-deploys

### Local development

```bash
npm install
npm run dev     # http://localhost:4321
npm run build   # Build for production
```

### Deployment

Push to `main` branch → auto-deploys to https://docs.hypertask.ai via Cloudflare Pages.

Manual deploy (if needed):
```bash
npm run build
CLOUDFLARE_ACCOUNT_ID=6031a7dff0d4a6469414cfa8a6dedddf npx wrangler pages deploy dist --project-name hypertask-docs
```

### Style guide

- Dark purple theme matching hypertask.ai
- Technical but approachable tone
- Code examples first, explanations second
- Use tables for parameter lists and comparisons
- Use `<Aside>` for important notes/warnings
- Use `<Tabs>` for multi-client code examples (Claude Desktop, Claude Code, Cursor)
- All API examples use `https://mcp.hypertask.ai` as base URL
- Task descriptions and comments use **HTML**, not Markdown
