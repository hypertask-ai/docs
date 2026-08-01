import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://docs.astro.dev/en/reference/configuration/#configuration-reference
export default defineConfig({
  integrations: [
    starlight({
      sidebar: {
        'Features': [
          'features/ai-features',
          'features/boards',
          'features/tasks',
          'features/inbox',
          'features/collaboration',
          'features/calendar',
          'features/table-view',
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
        ],
        'Getting started': [
          'getting-started/introduction',
          'getting-started/quickstart',
          'getting-started/concepts',
          'getting-started/settings-profile',
        ],
        'MCP': [
          'mcp/overview',
          'mcp/workflows',
          'mcp/scheduling',
          'mcp/agents',
        ],
        'API': [
          'api/rest-api',
          'api/tools-reference',
        ],
        'Design system': [
          'design-system/visual-standard',
          'design-system/typography',
        ],
      },
    }),
  ],
});