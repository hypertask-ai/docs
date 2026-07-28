import { defineConfig } from 'astro/config';
// run `npx astro add starlight` to install and add this file
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      lastUpdated: true,
      sidebar: [
        { label: 'Introduction', link: '/getting-started/introduction/' },
        { label: 'Quick Start', link: '/getting-started/quickstart/' },
        { label: 'Concepts', link: '/getting-started/concepts/' },
        { label: 'Guides', items: [
            { label: 'AI Features', link: '/features/ai-features/' },
            { label: 'Appearance & AI Models', link: '/features/appearance/' },
            { label: 'Boards & Sections', link: '/features/boards/' },
            { label: 'Tasks', link: '/features/tasks/' },
            { label: 'Inbox & Notifications', link: '/features/inbox/' },
            { label: 'Collaboration', link: '/features/collaboration/' },
            { label: 'Time Tracking', link: '/features/time-tracking/' },
            { label: 'Keyboard Shortcuts', link: '/features/keyboard-shortcuts/' },
            { label: 'Pages', link: '/features/pages/' },
            { label: 'Skills', link: '/features/skills/' },
            { label: 'Superhuman-Style Snippets', link: '/features/superhuman-snippets/' },
            { label: 'Table View', link: '/features/table-view/' },
            { label: 'Board Settings', link: '/features/board-settings/' },
            { label: 'Bring Your Own Key (BYOK)', link: '/features/byok/' },
            { label: 'Favorites', link: '/features/favorites/' },
            { label: 'AI Chat Board Filter', link: '/features/chat-board-filter/' },
        ]},
        { label: 'MCP Integration', items: [
            { label: 'Overview', link: '/mcp/overview/' },
            { label: 'Creating Agents', link: '/mcp/agents/' },
            { label: 'Agent Workflows', link: '/mcp/workflows/' },
            { label: 'Scheduling Agents', link: '/mcp/scheduling/' },
        ]},
        { label: 'CLI', link: '/cli/reference/' },
        { label: 'REST API', link: '/api/rest-api/' },
        { label: 'MCP Tools Reference', link: '/api/tools-reference/' },
        { label: 'Design System', items: [
            { label: 'Sidebar & Modal Visual Standard', link: '/design-system/visual-standard/' },
            { label: 'Typography & Sidebar Visuals', link: '/design-system/typography/' },
        ]},
        { label: 'Changelog', link: '/changelog/' },
      ],
    }),
  ],
});