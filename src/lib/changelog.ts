import { getCollection } from 'astro:content';

export async function getChanges() {
  return (await getCollection('changelog')).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime() || a.id.localeCompare(b.id),
  );
}

export function changeUrl(id: string) {
  return `/changelog/${id}/`;
}

export function formatDate(date: Date, monthOnly = false) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    ...(monthOnly ? {} : { day: 'numeric' }),
    timeZone: 'UTC',
  }).format(date);
}
