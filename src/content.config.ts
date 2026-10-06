import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
	changelog: defineCollection({
		loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/changelog' }),
		schema: z.object({
			date: z.coerce.date(),
			title: z.string().min(1),
			tags: z.array(z.string().min(1)).min(1),
			summary: z.string().min(1),
		}),
	}),
};
