// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.hypertask.ai',
	integrations: [
		starlight({
			title: 'Hypertask Docs',
			customCss: ['./src/styles/custom.css'],
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/valentinyeo/hypertask' }],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'What is Hypertask?', slug: 'getting-started/introduction' },
						{ label: 'Quick Start', slug: 'getting-started/quickstart' },
						{ label: 'Core Concepts', slug: 'getting-started/concepts' },
					],
				},
				{
					label: 'Features',
					items: [
						{ label: 'AI Features', slug: 'features/ai-features' },
						{ label: 'Boards & Sections', slug: 'features/boards' },
						{ label: 'Tasks', slug: 'features/tasks' },
						{ label: 'Inbox & Notifications', slug: 'features/inbox' },
						{ label: 'Collaboration', slug: 'features/collaboration' },
					],
				},
				{
					label: 'MCP Integration',
					items: [
						{ label: 'Overview', slug: 'mcp/overview' },
						{ label: 'Agent Workflows', slug: 'mcp/workflows' },
					],
				},
				{
					label: 'API Reference',
					items: [
						{ label: 'MCP Tools Reference', slug: 'api/tools-reference' },
					],
				},
			],
		}),
	],
});
