import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

const renderLegacyMdxComponents = {
  name: "render-legacy-mdx-components",
  enforce: "pre",
  transform(code, id) {
    const filePath = id.split("?", 1)[0];
    if (!filePath.includes("/src/content/docs/") || !filePath.endsWith(".mdx")) return;

    // Starlight only accepts note/tip/caution/danger, and an unknown type throws at
    // render time — which takes the whole site build down. Writers keep reaching for
    // Mintlify types (info, warning, example, detail), so map anything else to note
    // rather than enumerating types we have to keep chasing.
    const asideTypes = new Set(["note", "tip", "caution", "danger"]);
    const compatibleCode = code.replace(
      /<Aside type="([a-z]+)"/g,
      (match, type) =>
        asideTypes.has(type)
          ? match
          : `<Aside type="${type === "warning" ? "caution" : "note"}"`
    );

    return filePath.endsWith("/src/content/docs/changelog/index.mdx")
      ? compatibleCode
          // The changelog writer emits extra attributes (features={[<u/>]}), so match
          // anything up to the closing bracket — a stricter pattern leaves the opening
          // tags in place while the closers below are stripped, and MDX then fails.
          .replace(/<Update\s+label="([^"]+)"[^>]*>/g, "## $1")
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
          icon: "x.com",
          label: "X",
          href: "https://x.com/hypertasks",
        },
        {
          icon: "youtube",
          label: "YouTube",
          href: "https://www.youtube.com/@hypertasks",
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
            { label: "Board Settings", slug: "features/board-settings" },
            { label: "Bring Your Own Key", slug: "features/byok" },
            { label: "Chat Board Filter", slug: "features/chat-board-filter" },
            { label: "Keyboard Shortcuts", slug: "features/keyboard-shortcuts" },
            { label: "Tasks", slug: "features/tasks" },
            { label: "Pages", slug: "features/pages" },
            { label: "Table View", slug: "features/table-view" },
            { label: "Favorites", slug: "features/favorites" },
            { label: "Time Tracking", slug: "features/time-tracking" },
            { label: "Inbox & Notifications", slug: "features/inbox" },
            { label: "Collaboration", slug: "features/collaboration" },
            { label: "Superhuman-Style Snippets", slug: "features/superhuman-snippets" },
            { label: "Skills", slug: "features/skills" },
            { label: "Appearance", slug: "features/appearance" },
          ],
        },
        {
          label: "Account",
          items: [
            { label: "Profile & Settings", slug: "getting-started/settings-profile" },
          ],
        },
        {
          label: "Design System",
          items: [
            { label: "Visual Standard", slug: "design-system/visual-standard" },
            { label: "Typography", slug: "design-system/typography" },
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