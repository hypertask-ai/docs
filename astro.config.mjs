import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

export default defineConfig({
  vite: {
    define: {
      "globalThis.Astro": "undefined",
    },
    optimizeDeps: {
      exclude: ["mermaid"],
    },
  },
  integrations: [
    starlight({
      title: "Hypertask",
      favicon: "/favicon.ico",
      lastUpdated: true,
      aside: {
        collapseLevel: 1,
      },
      social: {
        twitter: "https://twitter.com/hypertask",
      },
      editLink: {
        services: [],
      },
      themeConfig: {
        defaultDark: "dim",
        disableLinkHash: true,
        editLink: {
          services: [
            {
              label: "GitHub",
              icon: "github",
              url: "https://github.com/hypertask-inc/hypertask-docs",
            },
          ],
        },
        sidebar: {
          "Getting Started": [
            { label: "What is Hypertask?", slug: "getting-started/introduction" },
            { label: "Core Concepts", slug: "getting-started/concepts" },
            { label: "Quick Start", slug: "getting-started/quickstart" },
          ],
          Features: [
            { label: "AI Features", slug: "features/ai-features" },
            { label: "Boards & Sections", slug: "features/boards" },
            { label: "Tasks", slug: "features/tasks" },
            { label: "Inbox & Notifications", slug: "features/inbox" },
            { label: "Collaboration", slug: "features/collaboration" },
            { label: "Superhuman-Style Snippets", slug: "features/superhuman-snippets" },
          ],
          API: [
            { label: "REST API", slug: "api/rest-api" },
            { label: "MCP Tools Reference", slug: "api/tools-reference" },
          ],
          MCP: [
            { label: "MCP Integration", slug: "mcp/overview" },
            { label: "Creating Agents", slug: "mcp/agents" },
            { label: "Agent Workflows", slug: "mcp/workflows" },
            { label: "Scheduling Agents", slug: "mcp/scheduling" },
          ],
          CLI: [{ label: "CLI Reference", slug: "cli/reference" }],
          Docs: [{ label: "Changelog", slug: "changelog" }],
        },
      },
    }),
  ],
});