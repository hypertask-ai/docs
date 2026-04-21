import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';

export const getStaticPaths: GetStaticPaths = async () => {
	const docs = await getCollection('docs');
	return docs.map((entry) => ({
		params: { slug: entry.id.replace(/\.mdx?$/, '') },
		props: { entry },
	}));
};

export const GET: APIRoute = ({ props }) => {
	const { entry } = props as { entry: Awaited<ReturnType<typeof getCollection>>[number] };
	const title = entry.data.title ?? '';
	const description = entry.data.description ?? '';
	const header = [`# ${title}`, description].filter(Boolean).join('\n\n');
	const body = entry.body ?? '';
	const markdown = `${header}\n\n${body}\n`;
	return new Response(markdown, {
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
	});
};
