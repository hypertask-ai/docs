import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { load } from 'js-yaml';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (file) => readFileSync(new URL(file, `file://${root}`), 'utf8');
const inventory = JSON.parse(read('inventory.json'));
const hash = (text) => createHash('sha256').update(text).digest('hex');

function decode(text) {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  return text.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (_, entity) =>
    entity.startsWith('#')
      ? String.fromCodePoint(entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : Number(entity.slice(1)))
      : named[entity.toLowerCase()],
  );
}

function plain(text) {
  return decode(text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<\/?(?:p|strong|li|ul|code|kbd|em|a)\b[^>]*>/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replaceAll('`', ''))
    .replaceAll(String.fromCodePoint(0x2014), ' - ')
    .replaceAll('â\\x80\\x94', ' - ')
    .replace(/\\+(['"])/g, '$1')
    .replace(/\s+/g, ' ').trim();
}

function record(source, date, entry, raw) {
  return {
    source, date, entry, text: plain(raw),
    tickets: [...new Set(plain(raw).match(/HTPR-\d+/gi) ?? [])].sort(),
    urls: [...new Set(raw.match(/https:\/\/app\.hypertask\.ai\/detail\/project-15\/\d+/g) ?? [])].sort(),
  };
}

function parseSource(source, raw, live = false) {
  const entries = [];
  let blocks;
  if (live) {
    blocks = [...raw.matchAll(/<section>([\s\S]*?)<\/section>/g)].map((match) => [
      match[1].match(/<h3>(.*?)<\/h3>/)?.[1],
      [...match[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map((item) => item[1]),
    ]);
  } else {
    const normalized = raw.replace(/<Update\s+label=["']([^"']+)["'][^>]*>/g, '\n## $1\n')
      .replace(/<\/Update>/g, '\n').replace(/\\+n/g, '\n');
    const headings = [...normalized.matchAll(/^## (\w+ \d+, \d{4})\s*$/gm)];
    blocks = headings.map((match, i) => [match[1], normalized.slice(match.index + match[0].length, headings[i + 1]?.index ?? normalized.length)]);
    blocks = blocks.map(([label, body]) => [label, body.split('\n')
      .map((line) => line.trim()).filter((line) => /^[*-] /.test(line) || /^<(p|li)>/.test(line) || /^(Added|Fixed|Improved|Changed|Removed|New):/i.test(line))
      .filter((line) => !line.includes('following tickets this run'))
      .map((line) => line.replace(/^[*-] /, ''))]);
  }
  for (const [label, items] of blocks) {
    assert(label, `Missing date in ${source}`);
    const date = new Date(`${label} UTC`).toISOString().slice(0, 10);
    items.forEach((item, i) => entries.push(record(source, date, i + 1, item)));
  }
  return entries;
}

const originals = [];
for (const source of inventory.sources) {
  const live = source.path === inventory.liveUrl;
  const raw = live ? read(inventory.liveSnapshot) : execFileSync('git', ['show', `${inventory.baseline}:${source.path}`], { cwd: root, encoding: 'utf8' });
  assert.equal(hash(raw), source.sha256, `Changed original snapshot: ${source.path}`);
  const entries = parseSource(source.path, raw, live);
  assert.equal(entries.length, source.count, `Original source count: ${source.path}`);
  originals.push(...entries);
}

// Discover forgotten dated announcement sources independently of the inventory list.
const baselineFiles = execFileSync('git', ['ls-tree', '-r', '--name-only', inventory.baseline], { cwd: root, encoding: 'utf8' }).trim().split('\n');
for (const file of baselineFiles.filter((file) => /(?:\.mdx?$|changelog\/index$)/.test(file))) {
  const raw = execFileSync('git', ['show', `${inventory.baseline}:${file}`], { cwd: root, encoding: 'utf8' });
  if (parseSource(file, raw).length) assert(inventory.sources.some((source) => source.path === file), `Source omitted: ${file}`);
}

const canonical = (entry) => JSON.stringify({
  source: entry.source, date: entry.date, entry: entry.entry, text: entry.text,
  tickets: [...entry.tickets].sort(), urls: [...entry.urls].sort(),
});
const mapped = inventory.entries.flatMap((entry) => entry.old.map((old) => ({ ...old, date: entry.date })));
assert.deepEqual(mapped.map(canonical).sort(), originals.map(canonical).sort(), 'Inventory must cover every original occurrence');
const unique = new Set(originals.map((entry) => `${entry.date}|${entry.text}`));
assert.equal(originals.length, inventory.oldCount);
assert.equal(unique.size, inventory.newCount);
assert.equal(inventory.entries.length, unique.size);
assert.equal(new Set(inventory.entries.map((entry) => entry.new)).size, unique.size);

const files = readdirSync(`${root}src/content/changelog`).filter((file) => /\.mdx?$/.test(file));
for (const file of files) {
  const raw = read(`src/content/changelog/${file}`);
  const frontmatter = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  assert(frontmatter, `Missing frontmatter: ${file}`);
  const data = load(frontmatter[1]);
  const date = new Date(data.date).toISOString().slice(0, 10);
  assert(file.startsWith(date), `Filename/date mismatch: ${file}`);
  assert(data.title.length > 0 && data.title.length <= 90 && !/[<>]|HTPR-\d+/i.test(data.title), `Plain short title: ${file}`);
  assert(Array.isArray(data.tags) && data.tags.length && data.tags.every((tag) => typeof tag === 'string' && tag.trim()), `Area tags: ${file}`);
  assert(typeof data.summary === 'string' && data.summary.length > 0 && data.summary.length <= 350, `Short summary: ${file}`);
  const sentences = [...new Intl.Segmenter('en', { granularity: 'sentence' }).segment(data.summary)];
  assert(sentences.length <= 2 && !/[<>\n]/.test(data.summary), `One or two plain summary sentences: ${file}`);
  assert(frontmatter[2].trim().length > data.summary.length, `Fuller explanation: ${file}`);
  assert(!raw.includes(String.fromCodePoint(0x2014)), `Long dash: ${file}`);
}
for (const entry of inventory.entries) {
  const raw = read(entry.new);
  assert(entry.new.startsWith(`src/content/changelog/${entry.date}-`));
  for (const old of entry.old) {
    assert(plain(raw).includes(old.text), `Lost text from ${old.source}: ${old.text}`);
    for (const ticket of old.tickets) assert(raw.toLowerCase().includes(ticket.toLowerCase()), `Lost ticket ${ticket}`);
    for (const url of old.urls) assert(raw.includes(`[${url}](${url})`), `Lost full ticket link: ${url}`);
  }
}

// Verify the fetched upstream independently so a rebase cannot hide new announcements.
assert(inventory.upstream, 'Missing verified upstream revision');
execFileSync('git', ['merge-base', '--is-ancestor', inventory.upstream, 'HEAD'], { cwd: root });
const upstreamFiles = execFileSync('git', ['ls-tree', '-r', '--name-only', inventory.upstream], { cwd: root, encoding: 'utf8' }).trim().split('\n');
let upstreamCount = 0;
for (const file of upstreamFiles.filter((file) => /(?:\.mdx?$|changelog\/index$)/.test(file))) {
  const raw = execFileSync('git', ['show', `${inventory.upstream}:${file}`], { cwd: root, encoding: 'utf8' });
  for (const original of parseSource(file, raw)) {
    upstreamCount++;
    const migrated = inventory.entries.find((entry) => entry.date === original.date && entry.old.some((old) => old.text === original.text));
    assert(migrated && plain(read(migrated.new)).includes(original.text), `Unmigrated upstream entry: ${file}: ${original.text}`);
  }
}
assert.equal(parseSource('hybrid fixture', '<Update label="January 1, 2099">\n* Added: First\n</Update>\n## January 2, 2099\nImproved: Second').length, 2);

// Positive controls ensure missing source entries, text, and ticket links are detectable.
const control = record('fixture', '2026-10-01', 1, 'Fixed: Keep data ([HTPR-123](https://app.hypertask.ai/detail/project-15/123))');
assert.throws(() => assert(plain('different announcement').includes(control.text)));
assert.throws(() => assert('HTPR-123'.includes(`[${control.urls[0]}](${control.urls[0]})`)));
assert.throws(() => assert.deepEqual([], [canonical(control)]));

console.log(`Old occurrences: ${originals.length}; distinct dated entries: ${unique.size}; migrated files: ${inventory.entries.length}; collection files: ${files.length}; live entries: ${originals.filter((entry) => entry.source === inventory.liveUrl).length}; upstream occurrences: ${upstreamCount}`);
console.log('CHANGELOG INVENTORY VERIFIED');
