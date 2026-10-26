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
        PageFrame: './src/components/PageFrame.astro',
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
            href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@700&family=Newsreader:wght@500&display=swap',
          },
        },
      ],
      sidebar: [
        { label: 'Connect a new agent', link: '/connect-an-agent/' },
        { label: 'Changelog', link: '/changelog/' },
        {
          label: 'Features',
          items: [
          'features/ai-features',
          'features/boards',
          'features/search-screen',
          'features/tasks',
          'features/scheduling',
          'features/inbox',
          'features/collaboration',
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
          label: 'Getting started',
          items: [
          'getting-started/introduction',
          'getting-started/apps',
          'getting-started/quickstart',
          'getting-started/concepts',
          'getting-started/settings-profile',
          'getting-started/security-and-privacy',
          'getting-started/contact-support',
          'getting-started/troubleshooting-login',
        ],
        },
        {
          label: 'MCP',
          items: [
          'mcp/overview',
          'mcp/troubleshooting',
          'mcp/workflows',
          'mcp/scheduling',
          'mcp/agents',
          'mcp/agent-webhooks',
        ],
        },
        {
          label: 'API',
          items: [
          'api/rest-api',
          'api/tools-reference',
        ],
        },
        {
          label: 'CLI',
          items: [
            'cli/reference',
            'cli/commands',
            'cli/tasks-assign',
          ],
        },
      ],
    }),
  ],
});