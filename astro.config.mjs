// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Hypertask Docs',
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
					autogenerate: { directory: 'features' },
				},
				{
					label: 'MCP Integration',
					autogenerate: { directory: 'mcp' },
				},
				{
					label: 'API Reference',
					autogenerate: { directory: 'api' },
				},
			],
		}),
	],
});
