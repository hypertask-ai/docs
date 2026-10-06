import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { legacyChangelogPaths } from '../src/lib/changelog-legacy.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (path) => readFileSync(join(root, path), 'utf8');
const inventory = JSON.parse(read('inventory.json'));
const append = read('scripts/fixtures/changelog-worker-append.mdx');
const logs = process.env.CHANGELOG_TEST_LOG_DIR || mkdtempSync(join(tmpdir(), 'changelog-legacy-build-'));
mkdirSync(logs, { recursive: true });
const temporaryEntry = 'src/content/changelog/2099-01-01-no-ticket-dedupe-fixture.md';
const written = [];
const directories = [];

for (const path of [...legacyChangelogPaths, temporaryEntry]) assert(!existsSync(join(root, path)), `Refusing to replace existing content: ${path}`);

function put(path, content) {
  const fullPath = join(root, path);
  const missing = [];
  for (let dir = dirname(fullPath); !existsSync(dir); dir = dirname(dir)) missing.push(dir);
  mkdirSync(dirname(fullPath), { recursive: true });
  directories.push(...missing.reverse());
  writeFileSync(fullPath, content);
  written.push(fullPath);
}

function cleanup() {
  for (const path of written.reverse()) unlinkSync(path);
  for (const dir of directories.reverse()) rmdirSync(dir);
  written.length = 0;
  directories.length = 0;
}

function build(name) {
  const result = spawnSync('npm', ['run', 'build'], { cwd: root, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
  writeFileSync(join(logs, `${name}.log`), output);
  assert.equal(result.status, 0, `${name} build failed: ${output.slice(-6000)}`);
  assert(!/Duplicate (?:route|id)|route collision/i.test(output), `${name}: route or collection collision`);
  assert(output.includes('[build] Complete!'), `${name}: incomplete build`);
}

function outputEntries() {
  const json = JSON.parse(read('dist/changelog.json'));
  const index = read('dist/changelog/index.html');
  const rss = read('dist/changelog.xml');
  const cards = [...index.matchAll(/<article class="changelog-card"[\s\S]*?<\/article>/g)].map((match) => match[0]);
  const items = [...rss.matchAll(/<item>[\s\S]*?<\/item>/g)].map((match) => match[0]);
  assert.equal(cards.length, json.items.length);
  assert.equal(items.length, json.items.length);
  assert.equal(new Set(json.items.map((item) => item.id)).size, json.items.length);
  assert(index.includes('class="changelog-months"'));
  assert(!existsSync(join(root, 'dist/changelog/index/index.html')), 'Legacy Starlight detail route must not exist');
  return { json, index, rss, cards, items };
}

try {
  build('absent-before');
  const baseline = outputEntries();
  assert.equal(baseline.json.items.length, inventory.newCount);
  put(temporaryEntry, '---\ndate: "2099-01-01"\ntitle: "No ticket dedupe fixture"\ntags: ["CLI"]\nsummary: "No ticket announcement stays readable."\n---\n\nNo ticket announcement stays readable.\n\n## Details\n\nImproved: No ticket announcement stays readable.\n');
  const duplicate = '\n## October 6, 2026\n- Improved: Task name wording changed in legacy (HTPR-6160) (HTPR-6161)\n\n## January 1, 2099\nImproved: No ticket announcement stays readable.\n';
  for (const [index, path] of legacyChangelogPaths.entries()) {
    const old = execFileSync('git', ['show', `${inventory.baseline}:${path}`], { cwd: root, encoding: 'utf8' });
    const unique = `\n## January 3, 2099\n- Improved: Retired source ${index + 1} still supplies CLI updates (HTPR-${9999800 + index})\n`;
    put(path, `${old}\n${append}\n${duplicate}\n${unique}`);
  }
  build('present');
  const present = outputEntries();
  const extra = legacyChangelogPaths.length + 3;
  assert.equal(present.json.items.length, baseline.json.items.length + extra, 'Existing migration and legacy duplicates must not add cards');
  for (const item of baseline.json.items) assert(present.json.items.some((current) => current.id === item.id), `Lost per-entry item: ${item.id}`);
  const expectedTitles = [
    'Legacy worker updates appear in changelog cards and feeds',
    'Legacy phone links stay readable',
    ...legacyChangelogPaths.map((_, index) => `Retired source ${index + 1} still supplies CLI updates`),
  ];
  for (const title of expectedTitles) {
    const matches = present.json.items.filter((item) => item.title === title);
    assert.equal(matches.length, 1, `Missing or duplicated legacy entry: ${title}`);
    const item = matches[0];
    const url = new URL(item.url).pathname;
    assert.equal(present.cards.filter((card) => card.includes(`<h3><a href="${url}">${title}</a></h3>`)).length, 1, `Missing card: ${title}`);
    assert.equal(present.items.filter((rssItem) => rssItem.includes(`<title>${title}</title>`) && rssItem.includes(item.url)).length, 1, `Missing RSS item: ${title}`);
    const page = read(`dist${url}index.html`);
    assert(page.includes(`>${title}</h1>`), `Missing entry page title: ${title}`);
    assert(page.includes('class="changelog-entry"'));
    assert(page.includes(`datetime="${item.date_published.slice(0, 10)}"`));
    assert(page.includes('https://app.hypertask.ai/detail/project-15/'), `Lost ticket link: ${title}`);
    assert(page.includes('Back to all'));
  }
  assert(!present.index.includes('Task name wording changed in legacy'), 'Ticket-id dedupe must prefer per-entry content');
  assert.equal(present.json.items.filter((item) => item.title === 'No ticket dedupe fixture').length, 1);
  console.log(`Worker append and all ${legacyChangelogPaths.length} retired paths verified: ${baseline.json.items.length} original entries plus ${extra} fixture entries, cards, pages, RSS and JSON feeds.`);
} finally {
  cleanup();
}
build('absent-after');
assert.equal(outputEntries().json.items.length, inventory.newCount, 'Legacy records must not survive after files are removed');
console.log(`Build logs: ${logs}`);
console.log('LEGACY BUILDS VERIFIED');
