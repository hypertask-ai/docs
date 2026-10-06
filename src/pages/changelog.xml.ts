import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getChanges, changeUrl } from '../lib/changelog';

export async function GET(context: APIContext) {
  const entries = await getChanges();

  return rss({
    title: 'Hypertask Changelog',
    description: 'New features, improvements, and fixes in Hypertask.',
    site: context.site!,
    items: entries.map((entry) => ({
      title: entry.data.title,
      description: entry.data.summary,
      pubDate: entry.data.date,
      categories: entry.data.tags,
      link: changeUrl(entry.id),
    })),
    customData: '<language>en-us</language>',
  });
}
