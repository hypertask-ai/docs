import type { APIContext } from 'astro';
import { getChanges, changeUrl } from '../lib/changelog';

export async function GET(context: APIContext) {
  const entries = await getChanges();
  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'Hypertask Changelog',
    description: 'New features, improvements, and fixes in Hypertask.',
    home_page_url: `${context.site}changelog/`,
    feed_url: `${context.site}changelog.json`,
    language: 'en',
    items: entries.map((entry) => ({
      id: new URL(changeUrl(entry.id), context.site).href,
      title: entry.data.title,
      content_text: entry.body,
      summary: entry.data.summary,
      tags: entry.data.tags,
      date_published: entry.data.date.toISOString(),
      url: new URL(changeUrl(entry.id), context.site).href,
    })),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: { 'Content-Type': 'application/feed+json' },
  });
}
