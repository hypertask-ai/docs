import { defineConfig } from 'astro/config';

const sidebars = {
  docs: [
    {
      label: 'Getting Started',
      items: [
        { link: '/getting-started/introduction/', text: 'What is Hypertask?' },
        { link: '/getting-started/quickstart/', text: 'Quick Start' },
        { link: '/getting-started/concepts/', text: 'Core Concepts' },
      ],
    },
    {
      label: 'Features',
      items: [
        { link: '/features/ai-features/', text: 'AI Features' },
        { link: '/features/appearance/', text: 'Appearance & AI Models' },
        { link: '/features/board-settings/', text: 'Board Settings' },
        { link: '/features/boards/', text: 'Boards & Sections' },
        { link: '/features/favorites/', text: 'Favorites' },
        { link: '/features/inbox/', text: 'Inbox & Notifications' },
        { link: '/features/keyboard-shortcuts/', text: 'Keyboard Shortcuts' },
        { link: '/features/pages/', text: 'Pages' },
        { link: '/features/skills/', text: 'Skills' },
        { link: '/features/superhuman-snippets/', text: 'Superhuman-Style Snippets' },
        { link: '/features/table-view/', text: 'Table View' },
        { link: '/features/tasks/', text: 'Tasks' },
        { link: '/features/time-tracking/', text: 'Time Tracking' },
        { link: '/features/collaboration/', text: 'Collaboration' },
      ],
    },
    {
      label: 'API Reference',
      items: [
        { link: '/api/tools-reference/', text: 'MCP Tools Reference' },
        { link: '/api/rest-api/', text: 'REST API' },
      ],
    },
    {
      label: 'Model Context Protocol',
      items: [
        { link: '/mcp/overview/', text: 'MCP Integration' },
        { link: '/mcp/agents/', text: 'Creating Agents' },
        { link: '/mcp/workflows/', text: 'Agent Workflows' },
        { link: '/mcp/scheduling/', text: 'Scheduling Agents' },
      ],
    },
    {
      label: 'Design System',
      items: [
        { link: '/design-system/typography/', text: 'Typography & Sidebar Visuals' },
        { link: '/design-system/visual-standard/', text: 'Sidebar & Modal Visual Standard' },
      ],
    },
    {
      label: 'Changelog',
      items: [{ link: '/changelog/', text: 'Changelog' }],
    },
  ],
};

export default defineConfig({
  site: 'https://docs.hypertask.ai',
  social: {
    twitter: 'https://twitter.com/hypertaskai',
  },
  plugins: [
    starlight({
      sidebar,
      // Other config...
      format: {
        metadata: 'leading_title_doc_title',
      },
    }),
  ],
});