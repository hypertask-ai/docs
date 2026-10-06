import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { announcementKeys, legacyChangelogPaths, parseLegacyChangelog } from '../src/lib/changelog-legacy.mjs';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const inventory = JSON.parse(read('inventory.json'));
const append = read('scripts/fixtures/changelog-worker-append.mdx');
const old = '<Update label="January 1, 2099">\n* Added: Board &amp; search updates (HTPR-9999700)\n</Update>';
const entries = parseLegacyChangelog(`${old}\n${append}`);
assert.equal(entries.length, 3, 'Hybrid Update and worker heading formats must both be read');
assert.deepEqual(entries.map((entry) => entry.data.date.toISOString().slice(0, 10)), ['2099-01-01', '2099-01-02', '2099-01-02']);
assert.equal(entries[0].data.title, 'Board & search updates');
assert.deepEqual(entries[0].data.tags, ['Board', 'Search']);
assert(entries[1].rendered.html.includes('<a href="https://app.hypertask.ai/detail/project-15/9999701">https://app.hypertask.ai/detail/project-15/9999701</a>'));
assert(entries[2].rendered.html.includes('https://app.hypertask.ai/detail/project-15/9999702'));
assert.deepEqual(parseLegacyChangelog(append), parseLegacyChangelog(append), 'Stable ids');

const overlaps = (date, left, right) => announcementKeys(date, left).some((key) => announcementKeys(date, right).includes(key));
assert(overlaps('2099-01-01', 'Fixed: Original wording (HTPR-1)', 'Different wording https://app.hypertask.ai/detail/project-15/1'));
assert(overlaps('2099-01-01', 'Added: Board &amp; search', 'Added: Board & search'));
assert(overlaps('2099-01-01', 'Changed (HTPR-1) (HTPR-2)', 'Changed (HTPR-2) (HTPR-1)'));
assert(!overlaps('2099-01-01', 'Changed (HTPR-1) (HTPR-2)', 'Different change (HTPR-1)'));
assert(!announcementKeys('2099-01-01', 'Changed (HTPR-1)').some((key) => announcementKeys('2099-01-02', 'Changed (HTPR-1)').includes(key)));
assert(!overlaps('2099-01-01', 'No ticket first announcement', 'No ticket second announcement'));
const html = parseLegacyChangelog('## January 1, 2099\n<p>Improved: &lt;script&gt;alert(1)&lt;/script&gt; (HTPR-9)</p>')[0].rendered.html;
assert(!html.includes('<script>'));
assert(html.includes('&lt;script&gt;'));
assert.throws(() => parseLegacyChangelog('## Notamonth 1, 2099\n- Fixed: Invalid date'), /Invalid date/);
assert.equal(parseLegacyChangelog('---\ntitle: Changelog\n---\nNo dated entries').length, 0);
const wrapped = parseLegacyChangelog('## January 1, 2099\n- Improved: CLI output\n  wraps over two lines (HTPR-9)')[0];
assert(wrapped.body.includes('wraps over two lines'));
const escaped = parseLegacyChangelog('<Update label="January 1, 2099">\\n<p>Fixed: Escaped lines (HTPR-9)</p>\\n</Update>');
assert.equal(escaped.length, 1);

let count = 0;
for (const path of legacyChangelogPaths) {
  const source = inventory.sources.find((source) => source.path === path);
  assert(source, `Retired source missing from inventory: ${path}`);
  const raw = execFileSync('git', ['show', `${inventory.baseline}:${path}`], { cwd: root, encoding: 'utf8' });
  const parsed = parseLegacyChangelog(raw, path);
  assert.equal(parsed.length, source.count, `Legacy intake source count: ${path}`);
  const originals = inventory.entries.flatMap((entry) => entry.old.filter((old) => old.source === path).map((old) => ({ ...old, date: entry.date })));
  for (const original of originals) {
    assert(parsed.some((entry) => entry.data.date.toISOString().startsWith(original.date) && entry.body.includes(original.text)), `Lost legacy text: ${original.text}`);
  }
  count += parsed.length;
}
console.log(`Parsed ${count} baseline occurrences across ${legacyChangelogPaths.length} retired paths; hybrid formats, dedupe keys, safe HTML and stable ids checked.`);
console.log('LEGACY PARSER VERIFIED');
