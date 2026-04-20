#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readdir, readFile, writeFile, unlink, mkdir } from "fs/promises";
import { join, relative, basename, dirname } from "path";
import { execSync } from "child_process";
import { existsSync } from "fs";

const DOCS_DIR = join(dirname(new URL(import.meta.url).pathname), "src/content/docs");
const CONFIG_PATH = join(dirname(new URL(import.meta.url).pathname), "astro.config.mjs");
const ROOT = dirname(new URL(import.meta.url).pathname);

const server = new McpServer({
  name: "hypertask-docs",
  version: "1.0.0",
});

// Helper: recursively list all .md/.mdx files
async function listAllPages(dir = DOCS_DIR, pages = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      await listAllPages(fullPath, pages);
    } else if (entry.name.endsWith(".md") || entry.name.endsWith(".mdx")) {
      const rel = relative(DOCS_DIR, fullPath);
      const content = await readFile(fullPath, "utf-8");
      const titleMatch = content.match(/^title:\s*(.+)$/m);
      const descMatch = content.match(/^description:\s*(.+)$/m);
      pages.push({
        path: rel,
        slug: rel.replace(/\.(mdx?|md)$/, ""),
        title: titleMatch ? titleMatch[1].replace(/^["']|["']$/g, "") : basename(rel),
        description: descMatch ? descMatch[1].replace(/^["']|["']$/g, "") : "",
      });
    }
  }
  return pages;
}

// Helper: resolve a page path from slug or path
function resolvePagePath(pathOrSlug) {
  // Try exact path first
  const exact = join(DOCS_DIR, pathOrSlug);
  if (existsSync(exact)) return exact;
  // Try with extensions
  for (const ext of [".mdx", ".md"]) {
    const p = join(DOCS_DIR, pathOrSlug + ext);
    if (existsSync(p)) return p;
  }
  // Try as slug (without extension)
  const slug = pathOrSlug.replace(/\.(mdx?|md)$/, "");
  for (const ext of [".mdx", ".md"]) {
    const p = join(DOCS_DIR, slug + ext);
    if (existsSync(p)) return p;
  }
  return null;
}

// Tool: list_pages
server.tool(
  "list_pages",
  "List all documentation pages with their paths, titles, and descriptions",
  {},
  async () => {
    const pages = await listAllPages();
    return {
      content: [{ type: "text", text: JSON.stringify(pages, null, 2) }],
    };
  }
);

// Tool: read_page
server.tool(
  "read_page",
  "Read the full content of a documentation page by its slug or path (e.g. 'features/ai-features' or 'getting-started/quickstart.mdx')",
  { page: z.string().describe("Page slug or file path, e.g. 'features/ai-features'") },
  async ({ page }) => {
    const filePath = resolvePagePath(page);
    if (!filePath) {
      return { content: [{ type: "text", text: `Error: Page '${page}' not found. Use list_pages to see available pages.` }] };
    }
    const content = await readFile(filePath, "utf-8");
    return {
      content: [{ type: "text", text: content }],
    };
  }
);

// Tool: write_page
server.tool(
  "write_page",
  `Create or update a documentation page. Provide the full MDX content including frontmatter.

Rules:
- Path should be relative to docs dir, e.g. 'features/new-feature.mdx'
- Files using Starlight components (Aside, Tabs, Card, etc.) MUST use .mdx extension
- Frontmatter must include 'title' and 'description'
- Use HTML in code examples (Hypertask API uses HTML, not Markdown)
- Available Starlight components: Aside, Tabs, TabItem, Steps, Card, CardGrid, LinkCard

Example frontmatter:
---
title: My Page Title
description: Short description for SEO.
---`,
  {
    path: z.string().describe("File path relative to docs dir, e.g. 'features/new-feature.mdx'"),
    content: z.string().describe("Full page content including frontmatter (---\\ntitle: ...\\n---)"),
    add_to_sidebar: z.boolean().optional().default(true).describe("Whether to add this page to the sidebar config (default: true)"),
  },
  async ({ path: pagePath, content, add_to_sidebar }) => {
    // Ensure .mdx extension if content has imports
    if (content.includes("import ") && !pagePath.endsWith(".mdx")) {
      pagePath = pagePath.replace(/\.md$/, ".mdx");
      if (!pagePath.endsWith(".mdx")) pagePath += ".mdx";
    }

    const fullPath = join(DOCS_DIR, pagePath);
    const dir = dirname(fullPath);

    // Create directory if needed
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }

    // Check if this is a new file
    const isNew = !existsSync(fullPath);

    // Write the file
    await writeFile(fullPath, content, "utf-8");

    // Extract title for sidebar
    const titleMatch = content.match(/^title:\s*(.+)$/m);
    const title = titleMatch ? titleMatch[1].replace(/^["']|["']$/g, "") : basename(pagePath, ".mdx");
    const slug = pagePath.replace(/\.(mdx?|md)$/, "");

    let result = `Page written to ${pagePath}`;

    if (isNew && add_to_sidebar) {
      result += `\n\nNOTE: New page created. You may need to add it to the sidebar in astro.config.mjs.`;
      result += `\nSlug: '${slug}'`;
      result += `\nTitle: '${title}'`;
      result += `\nSection directory: '${dirname(pagePath)}'`;
      result += `\n\nIf the section uses 'autogenerate', it will appear automatically.`;
      result += `\nOtherwise, add to the sidebar items array: { label: '${title}', slug: '${slug}' }`;
    }

    return { content: [{ type: "text", text: result }] };
  }
);

// Tool: read_sidebar_config
server.tool(
  "read_sidebar_config",
  "Read the current astro.config.mjs to see the sidebar structure",
  {},
  async () => {
    const content = await readFile(CONFIG_PATH, "utf-8");
    return { content: [{ type: "text", text: content }] };
  }
);

// Tool: update_sidebar_config
server.tool(
  "update_sidebar_config",
  "Update the astro.config.mjs file with new sidebar configuration. Provide the FULL file content.",
  {
    content: z.string().describe("Full content of astro.config.mjs"),
  },
  async ({ content }) => {
    await writeFile(CONFIG_PATH, content, "utf-8");
    return { content: [{ type: "text", text: "astro.config.mjs updated successfully." }] };
  }
);

// Tool: delete_page
server.tool(
  "delete_page",
  "Delete a documentation page",
  { page: z.string().describe("Page slug or file path to delete") },
  async ({ page }) => {
    const filePath = resolvePagePath(page);
    if (!filePath) {
      return { content: [{ type: "text", text: `Error: Page '${page}' not found.` }] };
    }
    await unlink(filePath);
    const rel = relative(DOCS_DIR, filePath);
    return {
      content: [{ type: "text", text: `Deleted ${rel}. Remember to remove it from the sidebar in astro.config.mjs if it was listed there.` }],
    };
  }
);

// Tool: build_and_deploy
server.tool(
  "build_and_deploy",
  "Build the docs site and deploy to Cloudflare Pages (docs.hypertask.ai). Also commits and pushes to GitHub.",
  {
    commit_message: z.string().optional().describe("Git commit message (default: 'Update docs')"),
  },
  async ({ commit_message }) => {
    const msg = commit_message || "Update docs";
    const results = [];

    try {
      // Build
      results.push("Building...");
      execSync("npm run build", { cwd: ROOT, stdio: "pipe", timeout: 60000 });
      results.push("Build successful.");

      // Git commit & push
      try {
        execSync("git add -A", { cwd: ROOT, stdio: "pipe" });
        execSync(`git commit -m "${msg.replace(/"/g, '\\"')}"`, { cwd: ROOT, stdio: "pipe" });
        execSync("git push origin main", { cwd: ROOT, stdio: "pipe" });
        results.push("Committed and pushed to GitHub.");
      } catch (e) {
        results.push("Git: " + (e.stderr?.toString() || "No changes to commit."));
      }

      // Deploy
      execSync(
        "CLOUDFLARE_ACCOUNT_ID=6031a7dff0d4a6469414cfa8a6dedddf npx wrangler pages deploy dist --project-name hypertask-docs",
        { cwd: ROOT, stdio: "pipe", timeout: 120000 }
      );
      results.push("Deployed to docs.hypertask.ai");
    } catch (e) {
      results.push("Error: " + (e.stderr?.toString() || e.message));
    }

    return { content: [{ type: "text", text: results.join("\n") }] };
  }
);

// Tool: build_preview
server.tool(
  "build_preview",
  "Build the docs site locally without deploying, to check for errors",
  {},
  async () => {
    try {
      const output = execSync("npm run build 2>&1", { cwd: ROOT, timeout: 60000 }).toString();
      const pages = output.match(/(\d+) page\(s\) built/)?.[1] || "?";
      return { content: [{ type: "text", text: `Build successful. ${pages} pages built.` }] };
    } catch (e) {
      return { content: [{ type: "text", text: "Build failed:\n" + (e.stdout?.toString() || e.message) }] };
    }
  }
);

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
