import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { parseChangelogEntries } from '../lib/changelog-parser';

export async function GET(context: APIContext) {
  const entries = await parseChangelogEntries();

  return rss({
    title: 'Hypertask Changelog',
    description: 'Daily log of new features, bug fixes, and improvements shipped to Hypertask.',
    site: context.site!.toString(),
    items: entries.map((entry) => ({
      title: `Changelog — ${entry.date}`,
      description: entry.html,
      pubDate: new Date(entry.date),
      link: `${context.site}changelog/`,
    })),
    customData: '<language>en-us</language>',
  });
}
