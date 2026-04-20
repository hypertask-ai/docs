import type { APIContext } from 'astro';
import { parseChangelogEntries } from '../lib/changelog-parser';

export async function GET(context: APIContext) {
  const entries = await parseChangelogEntries();

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'Hypertask Changelog',
    description: 'Daily log of new features, bug fixes, and improvements shipped to Hypertask.',
    home_page_url: `${context.site}changelog/`,
    feed_url: `${context.site}changelog.json`,
    language: 'en',
    items: entries.map((entry) => ({
      id: `${context.site}changelog/#${entry.date}`,
      title: `Changelog — ${entry.date}`,
      content_html: entry.html,
      date_published: new Date(entry.date).toISOString(),
      url: `${context.site}changelog/`,
    })),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: { 'Content-Type': 'application/feed+json' },
  });
}
