import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://docs.astro.dev/en/reference/configuration/#configuration-reference
export default defineConfig({
  site: 'https://docs.hypertask.ai',
  integrations: [
    starlight({
      title: 'Hypertask Docs',
      favicon: '/glyph-white.png',
      components: {
        SiteTitle: './src/components/SiteTitle.astro',
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
        {
          label: 'Features',
          items: [
          'features/ai-features',
          'features/boards',
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
          'features/cost-forecast',
          'features/superhuman-snippets',
          'features/observability',
          'features/slack',
        ],
        },
        {
          label: 'Getting started',
          items: [
          'getting-started/introduction',
          'getting-started/quickstart',
          'getting-started/concepts',
          'getting-started/settings-profile',
          'getting-started/troubleshooting-login',
        ],
        },
        {
          label: 'MCP',
          items: [
          'mcp/overview',
          'mcp/workflows',
          'mcp/scheduling',
          'mcp/agents',
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
          label: 'Design system',
          items: [
          'design-system/visual-standard',
          'design-system/typography',
        ],
      ],
    }),
  ],
});