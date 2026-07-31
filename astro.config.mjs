import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Load sidebar contents from sidebar.md synced with the docs repo
const sidebarPath = join(__dirname, 'sidebar.md');
const sidebarContent = readFileSync(sidebarPath, 'utf-8');
const sidebar = JSON.parse(sidebarContent);

export default defineConfig({
  integrations: [
    starlight({
      title: 'Hypertask',
      customCss: ['src/styles/index.css'],
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            type: 'image/svg+xml',
            href: '/favicon.svg'
          }
        }
      ],
      sidebar
    })
  ]
});