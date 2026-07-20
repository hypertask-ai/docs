import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      sidebar: {
        'Guide': [
           { 
             categories: [
               {
                 label: 'Core',
                 items: [
                   { uid: 'getting-started/introduction', label: "What is Hypertask?" },
                   { uid: 'getting-started/quickstart', label: 'Quick Start' },
                   { uid: 'getting-started/concepts', label: 'Core Concepts' }
                 ]
               },
               {
                 label: 'Features',
                 items: [
                   { uid: 'features/ai-features', label: 'AI Features' },
                   { uid: 'features/appearance', label: 'Appearance & AI Models' },
                   { uid: 'features/boards', label: 'Boards & Sections' },
                   { uid: 'features/byok', label: 'Bring Your Own Key (BYOK)' },
                   { uid: 'features/collaboration', label: 'Collaboration' },
                   { uid: 'features/favorites', label: 'Favorites' },
                   { uid: 'features/inbox', label: 'Inbox & Notifications' },
                   { uid: 'features/keyboard-shortcuts', label: 'Keyboard Shortcuts' },
                   { uid: 'features/skills', label: 'Skills' },
                   { uid: 'features/superhuman-snippets', label: 'Superhuman-Style Snippets' },
                   { uid: 'features/tasks', label: 'Tasks' },
                   { uid: 'features/time-tracking', label: 'Time Tracking' },
                   { uid: 'features/tasks', label: 'Tasks' }
                 ]
               },
               {
                 label: 'MCP',
                 items: [
                   { uid: 'mcp/overview', label: 'MCP Integration' },
                   { uid: 'mcp/agents', label: 'Creating Agents' },
                   { uid: 'mcp/workflows', label: 'Agent Workflows' },
                   { uid: 'mcp/scheduling', label: 'Scheduling Agents' }
                 ]
               }
             ]
           }
        ]
      }
    })
  ],
  vite: {
    clearScreen: false
  }
});