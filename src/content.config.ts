import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { readFile } from 'node:fs/promises';
import { announcementKeys, legacyChangelogPaths, parseLegacyChangelog } from './lib/changelog-legacy.mjs';

export const collections = {
	docs: defineCollection({
		loader: {
			...docsLoader(),
			// The cron can recreate this file. Intake belongs to changelog, not Starlight routing.
			load: glob({
				pattern: ['**/[^_]*.{markdown,mdown,mkdn,mkd,mdwn,md,mdx}', '!changelog/index.mdx'],
				base: './src/content/docs',
			}).load,
		},
		schema: docsSchema(),
	}),
	changelog: defineCollection({
		loader: {
			name: 'changelog-with-legacy-intake',
			async load(context) {
				await glob({ pattern: '**/*.{md,mdx}', base: './src/content/changelog' }).load(context);
				const known = new Set<string>();
				for (const entry of context.store.values()) {
					const details = entry.body?.match(/## Details\s*\n([\s\S]*?)(?:\n## |$)/)?.[1] ?? entry.body ?? '';
					for (const text of [details, entry.body ?? '', String(entry.data.summary)]) {
						for (const key of announcementKeys(entry.data.date, text)) known.add(key);
					}
				}
				for (const path of legacyChangelogPaths) {
					let raw: string;
					try {
						raw = await readFile(new URL(path, context.config.root), 'utf8');
					} catch (error) {
						if ((error as NodeJS.ErrnoException).code === 'ENOENT') continue;
						throw error;
					}
					for (const { keys, ...entry } of parseLegacyChangelog(raw, path)) {
						if (keys.some((key) => known.has(key))) continue;
						context.store.set({
							...entry,
							data: await context.parseData({ id: entry.id, data: entry.data }),
							digest: context.generateDigest(entry.body),
						});
						for (const key of keys) known.add(key);
					}
				}
			},
		},
		schema: z.object({
			date: z.coerce.date(),
			title: z.string().min(1),
			tags: z.array(z.string().min(1)).min(1),
			summary: z.string().min(1),
		}),
	}),
};
