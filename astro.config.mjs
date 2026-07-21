import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  plugins: [
    starlight({
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { link: '/getting-started/introduction/', label: 'What is Hypertask?' },
            { link: '/getting-started/quickstart/', label: 'Quick Start' },
            { link: '/getting-started/concepts/', label: 'Core Concepts' },
            { link: '/getting-started/settings-profile/', label: 'Profile & Settings' },
          ],
        },
        {
          label: 'Features',
          items: [
            {
              label: 'Boards & Sections',
              link: '/features/boards/',
              items: [
                { link: '/features/comments/', label: 'Comments' },
                { link: '/features/collaboration/', label: 'Collaboration' },
                { link: '/features/favorites/', label: 'Favorites' },
                { link: '/features/sections/', label: 'Sections' },
                { link: '/features/skills/', label: 'Skills' },
                { link: '/features/superhuman-snippets/', label: 'Superhuman-Style Snippets' },
                {
                  label: 'AI Chat',
                  link: '/features/.
AI-chat/',
                  items: [
                    { link: '/features/appearance/', label: 'Appearance & AI Models' },
                    { link: '/features/ai-features/', label: 'AI Features' },
                    { link: '/features/chat-board-filter/', label: 'Board Filter' },
                  ],
                },
                { link: '/features/tasks/', label: 'Tasks' },
                { link: '/features/time-tracking/', label: 'Time Tracking' },
              ],
            },
            {
              label: 'CLI & API',
              link: '/cli/reference/',
              items: [
                { link: '/api/tools-reference/', label: 'MCP Tools Reference' },
                { link: '/api/rest-api/', label: 'REST API' },
              ],
            },
            {
              label: 'MCP Integration',
              link: '/mcp/overview/',
              items: [
                { link: '/mcp/agents/', label: 'Creating Agents' },
                { link: '/mcp/workflows/', label: 'Agent Workflows' },
                { link: '/mcp/scheduling/', label: 'Scheduling Agents' },
              ],
            },
          ],
        },
        {
          label: 'Design System',
          link: '/design-system/',
          items: [
            { link: '/design-system/typography/', label: 'Typography & Sidebar Visuals' },
            { link: '/design-system/visual-standard/', label: 'Sidebar & Modal Visual Standard' },
          ],
        },
        {
          label: 'Misc',
          items: [
            { link: '/changelog/', label: 'Changelog' },
          ],
        },
      ],
    }),
  ],
});