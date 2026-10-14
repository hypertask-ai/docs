import { getCollection } from 'astro:content';

export const SITE = 'https://docs.hypertask.ai';

const SECTIONS: { title: string; prefix: string }[] = [
	{ title: 'Getting started', prefix: 'getting-started/' },
	{ title: 'Features', prefix: 'features/' },
	{ title: 'MCP', prefix: 'mcp/' },
	{ title: 'API', prefix: 'api/' },
	{ title: 'CLI', prefix: 'cli/' },
];

const strip = (id: string) => id.replace(/\.mdx?$/, '');
const url = (id: string) => `${SITE}/${strip(id)}/`;
const one = (text = '') => text.replace(/\s+/g, ' ').replace(/ ?\u2014 ?/g, ', ').trim();

export async function getDocs() {
	const docs = await getCollection('docs');
	return docs
		.filter((d) => !d.data.draft && !strip(d.id).startsWith('docs/') && strip(d.id) !== 'index')
		.sort((a, b) => strip(a.id).localeCompare(strip(b.id)));
}

export async function buildLlmsTxt(): Promise<string> {
	const docs = await getDocs();
	const line = (d: (typeof docs)[number]) =>
		`- [${d.data.title}](${url(d.id)})${d.data.description ? `: ${one(d.data.description)}` : ''}`;
	const out = [
		'# Hypertask',
		'',
		'> Hypertask is a task board where people and AI agents work together. These docs cover boards, tasks, agents, the CLI, MCP and the API.',
		'',
		'## Start here',
		'',
		`- [Connect a new agent](${SITE}/connect-an-agent/): Create an agent, copy its token, give it board access and connect it with the CLI or MCP.`,
		`- [Full documentation as one file](${SITE}/llms-full.txt)`,
		'',
	];
	for (const s of SECTIONS) {
		const items = docs.filter((d) => strip(d.id).startsWith(s.prefix));
		if (!items.length) continue;
		out.push(`## ${s.title}`, '', ...items.map(line), '');
	}
	return out.join('\n');
}

export async function buildLlmsFull(): Promise<string> {
	const docs = await getDocs();
	const ordered = [
		...docs.filter((d) => strip(d.id) === 'connect-an-agent'),
		...docs.filter((d) => strip(d.id) !== 'connect-an-agent'),
	];
	return (
		['# Hypertask documentation', '', ...ordered.flatMap((d) => [`# ${d.data.title}`, `Source: ${url(d.id)}`, '', d.body ?? '', ''])].join('\n')
	);
}
