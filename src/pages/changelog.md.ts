import type { APIRoute } from 'astro';
import { getChanges, changeUrl, formatDate } from '../lib/changelog';

export const GET: APIRoute = async () => {
  const entries = await getChanges();
  const markdown = ['# Changelog', ...entries.map((entry) =>
    `## ${entry.data.title}\n\n${formatDate(entry.data.date)} | ${entry.data.tags.join(', ')}\n\n${entry.data.summary}\n\n[Read more](https://docs.hypertask.ai${changeUrl(entry.id)})`,
  )].join('\n\n');
  return new Response(`${markdown}\n`, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
