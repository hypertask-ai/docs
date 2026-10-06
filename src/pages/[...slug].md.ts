import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';

export const getStaticPaths: GetStaticPaths = async () => {
	const docs = await getCollection('docs');
	const changes = await getCollection('changelog');
	return [
		...docs.map((entry) => ({
			params: { slug: entry.id.replace(/\.mdx?$/, '') },
			props: { entry },
		})),
		...changes.map((entry) => ({
			params: { slug: `changelog/${entry.id}` },
			props: { entry },
		})),
	];
};

export const GET: APIRoute = ({ props }) => {
	const { entry } = props as { entry: CollectionEntry<'docs'> | CollectionEntry<'changelog'> };
	const title = entry.data.title;
	const description = 'summary' in entry.data ? entry.data.summary : entry.data.description ?? '';
	const header = [`# ${title}`, description].filter(Boolean).join('\n\n');
	const body = entry.body ?? '';
	const markdown = `${header}\n\n${body}\n`;
	return new Response(markdown, {
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
	});
};
