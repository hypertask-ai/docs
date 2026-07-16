import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

const renderLegacyMdxComponents = {
  name: "render-legacy-mdx-components",
  enforce: "pre",
  transform(code, id) {
    const filePath = id.split("?", 1)[0];
    if (!filePath.includes("/src/content/docs/") || !filePath.endsWith(".mdx")) return;

    const compatibleCode = code
      .replaceAll('<Aside type="warning"', '<Aside type="caution"')
      .replaceAll('<Aside type="info"', '<Aside type="note"')
      .replaceAll('<Aside type="example"', '<Aside type="note"');

    return filePath.endsWith("/src/content/docs/changelog/index.mdx")
      ? compatibleCode
          .replace(/<Update label="([^"]+)">/g, "## $1")
          .replaceAll("</Update>", "")
      : compatibleCode;
  },
};

export default defineConfig({
  site: "https://docs.hypertask.ai",
  vite: {
    plugins: [renderLegacyMdxComponents],
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
      social: [
        {
          icon: "twitter",
          label: "Twitter",
          href: "https://twitter.com/hypertask",
        },
      ],
      sidebar: [
        {
          label: "Getting Started",
          items: [
            { label: "What is Hypertask?", slug: "getting-started/introduction" },
            { label: "Core Concepts", slug: "getting-started/concepts" },
            { label: "Quick Start", slug: "getting-started/quickstart" },
          ],
        },
        {
          label: "Features",
          items: [
            { label: "AI Features", slug: "features/ai-features" },
            { label: "Boards & Sections", slug: "features/boards" },
            { label: "Keyboard Shortcuts", slug: "features/keyboard-shortcuts" },
            { label: "Tasks", slug: "features/tasks" },
            { label: "Inbox & Notifications", slug: "features/inbox" },
            { label: "Collaboration", slug: "features/collaboration" },
            { label: "Superhuman-Style Snippets", slug: "features/superhuman-snippets" },
          ],
        },
        {
          label: "API",
          items: [
            { label: "REST API", slug: "api/rest-api" },
            { label: "MCP Tools Reference", slug: "api/tools-reference" },
          ],
        },
        {
          label: "MCP",
          items: [
            { label: "MCP Integration", slug: "mcp/overview" },
            { label: "Creating Agents", slug: "mcp/agents" },
            { label: "Agent Workflows", slug: "mcp/workflows" },
            { label: "Scheduling Agents", slug: "mcp/scheduling" },
          ],
        },
        {
          label: "CLI",
          items: [{ label: "CLI Reference", slug: "cli/reference" }],
        },
        {
          label: "Docs",
          items: [{ label: "Changelog", slug: "changelog" }],
        },
      ],
    }),
  ],
});
