import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://docs.astro.dev/en/reference/configuration/#configuration-reference
export default defineConfig({
  site: 'https://docs.hypertask.ai',
  markdown: { smartypants: false },
  redirects: {
    '/features/desktop': '/getting-started/apps/',
  },
  integrations: [
    starlight({
      title: 'Hypertask Docs',
      favicon: '/glyph-white.png',
      components: {
        SiteTitle: './src/components/SiteTitle.astro',
        Header: './src/components/Header.astro',
        ThemeProvider: './src/components/ThemeProvider.astro',
        PageFrame: './src/components/PageFrame.astro',
        PageTitle: './src/components/PageTitle.astro',
      },
      customCss: ['./src/styles/custom.css'],
      head: [
        {
          tag: 'link',
          attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        },
        {
          tag: 'link',
          attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=Newsreader:wght@400&display=swap',
          },
        },
      ],
      sidebar: [
        {
          label: 'Getting started',
          collapsed: false,
          items: [
            { label: 'Overview', link: '/' },
            'getting-started/introduction',
            { label: 'Quickstart', slug: 'getting-started/quickstart' },
            'getting-started/switching',
            { label: 'Core concepts', slug: 'getting-started/concepts' },
            'getting-started/settings-profile',
            'getting-started/security-and-privacy',
            'getting-started/troubleshooting-login',
            'getting-started/apps',
            'getting-started/contact-support',
          ],
        },
        {
          label: 'Explore the platform',
          collapsed: false,
          items: [
            { label: 'AI features', slug: 'features/ai-features' },
            'features/ai-chat-capabilities',
            { label: 'Boards & sections', slug: 'features/boards' },
            'features/search-screen',
            { label: 'Tasks', slug: 'features/tasks' },
            'features/scheduling',
            { label: 'Inbox & notifications', slug: 'features/inbox' },
            { label: 'Collaboration', slug: 'features/collaboration' },
            'features/calendar',
            'features/table-view',
            'features/custom-fields',
            'features/time-tracking',
            'features/appearance',
            'features/keyboard-shortcuts',
            'features/pages',
            'features/skills',
            'features/favorites',
            'features/byok',
            'features/board-settings',
            'features/chat-board-filter',
            'features/superhuman-snippets',
            'features/integrations',
            'features/slack',
            'features/agents',
            'features/agent-chat',
            'features/images',
          ],
        },
        {
          label: 'Reference',
          collapsed: false,
          items: [
            { label: 'CLI reference', slug: 'cli/reference' },
            'cli/commands',
            'cli/tasks-assign',
            { label: 'MCP integration', slug: 'mcp/overview' },
            'mcp/troubleshooting',
            'mcp/workflows',
            'mcp/scheduling',
            'mcp/agents',
            'mcp/agent-webhooks',
            'api/rest-api',
            { label: 'MCP tools reference', slug: 'api/tools-reference' },
            { label: 'Connect a new agent', link: '/connect-an-agent/' },
            { label: 'Changelog', link: '/changelog/' },
          ],
        },
      ],
    }),
  ],
});