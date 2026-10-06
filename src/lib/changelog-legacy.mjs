import { createHash } from 'node:crypto';

export const legacyChangelogPaths = [
  'src/content/docs/changelog/index.mdx',
  'src/content/docs/changelog/index',
  'changelog/index.mdx',
  'CHANGELOG.md',
  'docs/changelog/index.mdx',
  'docs/changelog/test.mdx',
  'hypertask/docs/changelog/index.mdx',
  'try-edit.md',
];

export function plainAnnouncement(text) {
  const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<\/?(?:p|strong|li|ul|code|kbd|em|a)\b[^>]*>/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replaceAll('`', '')
    .replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (_, entity) =>
      entity.startsWith('#')
        ? String.fromCodePoint(entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : Number(entity.slice(1)))
        : entities[entity.toLowerCase()],
    )
    .replaceAll(String.fromCodePoint(0x2014), ' - ')
    .replaceAll('â\\x80\\x94', ' - ')
    .replace(/\\+(['"])/g, '$1')
    .replace(/\s+/g, ' ').trim();
}

export function announcementKeys(date, text) {
  const day = new Date(date).toISOString().slice(0, 10);
  const plain = plainAnnouncement(text);
  const tickets = [...plain.matchAll(/HTPR-(\d+)|https:\/\/app\.hypertask\.ai\/detail\/project-15\/(\d+)/gi)]
    .map((match) => match[1] ?? match[2]);
  // Multi-ticket announcements can describe several different changes for one ticket.
  const ticketKey = [...new Set(tickets)].sort().join(',');
  return [
    `${day}|text|${plain.toLowerCase()}`,
    ...(ticketKey ? [`${day}|tickets|${ticketKey}`] : []),
  ];
}

function shortText(text, limit) {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit - 3).replace(/\s+\S*$/, '').trimEnd()}...`;
}

function areaTags(text) {
  const areas = [
    ['AI', /\bai\b|agent|chat|dictation/i],
    ['Board', /board|kanban|column/i],
    ['Tasks', /task|ticket|comment/i],
    ['Search', /search/i],
    ['Mobile', /mobile|phone|keyboard/i],
    ['CLI', /\bcli\b|command.line/i],
    ['MCP', /\bmcp\b/i],
    ['API', /\bapi\b/i],
    ['Inbox', /inbox|notification|remind/i],
    ['Settings', /setting|flag/i],
  ];
  const tags = areas.filter(([, pattern]) => pattern.test(text)).map(([tag]) => tag);
  return tags.length ? tags : ['Hypertask'];
}

const escapeHtml = (text) => text.replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);

export function parseLegacyChangelog(raw, source = 'legacy changelog') {
  const normalized = raw.replace(/<Update\s+label=["']([^"']+)["'][^>]*>/g, '\n## $1\n')
    .replace(/<\/Update>/g, '\n').replace(/\\+n/g, '\n');
  const headings = [...normalized.matchAll(/^## (\w+ \d+, \d{4})\s*$/gm)];
  return headings.flatMap((heading, index) => {
    const date = new Date(`${heading[1]} UTC`);
    if (Number.isNaN(date.getTime())) throw new Error(`Invalid date in ${source}: ${heading[1]}`);
    const day = date.toISOString().slice(0, 10);
    const block = normalized.slice(heading.index + heading[0].length, headings[index + 1]?.index ?? normalized.length);
    const items = [];
    for (const line of block.split('\n')) {
      const trimmed = line.trim();
      if (/^[*-] |^<(?:p|li)>|^(?:Added|Fixed|Improved|Changed|Removed|New):/i.test(trimmed)) {
        if (!trimmed.includes('following tickets this run')) items.push(trimmed.replace(/^[*-] /, ''));
      } else if (/^\s+\S/.test(line) && items.length && !trimmed.startsWith('<')) {
        items[items.length - 1] += ` ${trimmed}`;
      }
    }
    return items.map((item) => {
      const text = plainAnnouncement(item);
      const urls = [...new Set([
        ...item.match(/https:\/\/app\.hypertask\.ai\/detail\/project-15\/\d+/g) ?? [],
        ...[...text.matchAll(/HTPR-(\d+)/gi)].map((match) => `https://app.hypertask.ai/detail/project-15/${match[1]}`),
      ])];
      const description = text.replace(/\s*\(?HTPR-\d+\)?/gi, '')
        .replace(/\s*\(?https:\/\/app\.hypertask\.ai\/detail\/project-15\/\d+\)?/g, '').trim();
      const title = shortText(description.replace(/^(?:Added|Fixed|Improved|Changed|Removed|New):\s*/i, ''), 90);
      const sentences = [...new Intl.Segmenter('en', { granularity: 'sentence' }).segment(description)].slice(0, 2);
      const summary = shortText(sentences.map((sentence) => sentence.segment).join('').trim(), 350);
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const id = `${day}-${slug}-${createHash('sha256').update(text).digest('hex').slice(0, 10)}`;
      const links = urls.map((url) => `<li><a href="${url}">${url}</a></li>`).join('');
      return {
        id,
        data: { date, title, tags: areaTags(description), summary },
        body: `${summary}\n\n## Details\n\n${text}\n\n## Related tickets\n\n${urls.map((url) => `- [${url}](${url})`).join('\n')}`,
        rendered: { html: `<p>${escapeHtml(summary)}</p><h2>Details</h2><p>${escapeHtml(text)}</p>${links ? `<h2>Related tickets</h2><ul>${links}</ul>` : ''}` },
        keys: announcementKeys(date, text),
      };
    });
  });
}
