#!/usr/bin/env node
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'parse5';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SITE = process.env.DOCS_SITE_URL ?? 'https://docs.hypertask.ai';
// The release documents these legacy root aliases in its catalog. Canonical
// help headings use the singular names; validate the rest of the path normally.
export const CLI_ALIASES = { tasks: 'task', projects: 'project', views: 'view' };

export function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? files(join(dir, e.name)) : [join(dir, e.name)]).sort();
}

export function extractLinks(html) {
  const links = [];
  function visit(node) {
    for (const attr of node.attrs ?? []) if (attr.name === 'href') links.push(attr.value);
    for (const child of node.childNodes ?? []) visit(child);
  }
  visit(parse(html));
  return [...new Set(links)];
}

export function localLinkFile(href, htmlFile, dist, site = SITE) {
  const page = relative(dist, htmlFile).split('/').map(encodeURIComponent).join('/').replace(/index\.html$/, '');
  const url = new URL(href, `${site}/${page}`);
  if (url.origin !== new URL(site).origin || !['http:', 'https:'].includes(url.protocol)) return null;
  const path = resolve(dist, '.' + decodeURIComponent(url.pathname));
  if (path !== resolve(dist) && !path.startsWith(resolve(dist) + '/')) return '';
  const candidates = [path, join(path, 'index.html'), path + '.html'];
  return candidates.find((p) => existsSync(p) && statSync(p).isFile()) ?? '';
}

export function extractToolNames(text) {
  // npm package names are identifiers, not MCP tools.
  return [...new Set([...text.matchAll(/(?<![\w/@-])hypertask_[a-zA-Z0-9_]+\b/g)].map((m) => m[0]).filter((name) => name !== 'hypertask_cli'))];
}

export function extractCliMentions(text) {
  // Command examples/headings are code, not prose such as "hypertask is" or URLs.
  const snippets = [
    ...[...text.matchAll(/`+([^`]+)`+/g)].map((m) => m[1]),
    ...[...text.matchAll(/^#{1,6}\s+(hypertask .+)$/gm)].map((m) => m[1]),
    ...[...text.matchAll(/<code>(hypertask [^<]+)<\/code>/g)].map((m) => m[1]),
  ];
  return [...new Set(snippets.flatMap((s) => [...s.matchAll(/^[ \t]*(?:\$[ \t]+)?hypertask ((?:[a-z][a-z0-9-]*)(?:[ \t]+[a-z][a-z0-9-]*)*)/gm)].map((m) => m[1])))];
}

export function unknownCliMentions(text, commands) {
  return extractCliMentions(text).filter((mention) => {
    const words = mention.split(/[ \t]+/);
    words[0] = CLI_ALIASES[words[0]] ?? words[0];
    // Positional values can follow a leaf command. Unknown children of a group
    // must fail rather than passing just because the root command exists.
    for (let n = words.length; n > 0; n--) {
      const candidate = words.slice(0, n).join(' ');
      if (commands.has(candidate)) return [...commands].some((c) => c.startsWith(candidate + ' ')) && n < words.length;
    }
    return true;
  });
}

export function extractImages(text) {
  const refs = new Map([...text.matchAll(/^\s*\[([^\]]+)\]:\s*<?([^\s>]+)>?/gm)].map((m) => [m[1].toLowerCase(), m[2]]));
  const images = [...text.matchAll(/!\[[^\]]*\]\(\s*<?([^\s)>]+)>?(?:[^)]*)\)/g)].map((m) => m[1]);
  for (const m of text.matchAll(/!\[([^\]]*)\]\[([^\]]*)\]/g)) images.push(refs.get((m[2] || m[1]).toLowerCase()) ?? `missing-reference:${m[2] || m[1]}`);
  for (const m of text.matchAll(/!\[([^\]]+)\](?![([])/g)) if (refs.has(m[1].toLowerCase())) images.push(refs.get(m[1].toLowerCase()));
  for (const m of text.matchAll(/<(?:img|Image)\b[^>]*?\bsrc\s*=\s*(?:\{\s*)?['"]([^'"]+)['"]/g)) images.push(m[1]);
  const imports = new Map([...text.matchAll(/import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g)].map((m) => [m[1], m[2]]));
  for (const m of text.matchAll(/<(?:img|Image)\b[^>]*?\bsrc\s*=\s*\{(\w+)\}/g)) images.push(imports.get(m[1]) ?? `unresolved-image:${m[1]}`);
  return [...new Set(images)];
}

export function extractLlmsUrls(text, site = SITE) {
  return [...new Set([...text.matchAll(/\[[^\]]*\]\(([^\s)]+)\)/g)].map((m) => new URL(m[1], site).href))];
}

export async function boundedMap(items, fn, concurrency = 6) {
  let next = 0;
  const results = new Array(items.length);
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (next < items.length) { const i = next++; results[i] = await fn(items[i]); }
  }));
  return results;
}

export async function checkUrl(url, nonEmpty = true) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(15_000) });
    if (response.status !== 200) return { error: `HTTP ${response.status}`, text: '' };
    const text = await response.text();
    if (nonEmpty && !text.trim()) return { error: 'empty response', text };
    return { text };
  } catch { return { error: 'request failed or timed out', text: '' }; }
}

export async function runNightly(root = ROOT, site = SITE) {
  const failures = [];
  const dist = join(root, 'dist');
  const htmlFiles = files(dist).filter((p) => p.endsWith('.html'));
  const content = ['docs', 'changelog'].flatMap((collection) => files(join(root, 'src/content', collection)).filter((p) => /\.mdx?$/.test(p)));
  const toolReference = readFileSync(join(root, 'src/content/docs/api/tools-reference.mdx'), 'utf8');
  const tools = new Set([...toolReference.matchAll(/^### `([^`]+)`/gm)].map((m) => m[1]));
  const cliReference = readFileSync(join(root, 'src/content/docs/cli/commands.mdx'), 'utf8');
  const commands = new Set([...cliReference.matchAll(/^## `hypertask ([^`]+)`/gm)].map((m) => m[1]));
  if (!tools.size || !commands.size) failures.push('generated references are empty');
  let links = 0;
  const redirects = new Set();
  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf8');
    const head = parse(html).childNodes.find((node) => node.tagName === 'html')?.childNodes.find((node) => node.tagName === 'head');
    if (head?.childNodes.some((node) => node.tagName === 'meta' && node.attrs.some((attr) => attr.name === 'http-equiv' && attr.value.toLowerCase() === 'refresh'))) redirects.add(file);
    for (const href of extractLinks(html)) {
      links++;
      try {
        if (localLinkFile(href, file, dist, site) === '') failures.push(`${relative(root, file)}: broken link ${href}`);
      } catch { failures.push(`${relative(root, file)}: invalid link ${href}`); }
    }
  }
  const urls = new Set();
  const images = new Set();
  for (const file of content) {
    const text = readFileSync(file, 'utf8');
    // The generated reference quotes the server's own descriptions; a wrong name there is an app bug, not docs drift.
    const generated = file.endsWith('api/tools-reference.mdx');
    if (!generated) for (const name of extractToolNames(text)) if (!tools.has(name)) failures.push(`${relative(root, file)}: unknown tool ${name}`);
    for (const command of unknownCliMentions(text, commands)) failures.push(`${relative(root, file)}: unknown CLI command hypertask ${command}`);
    for (const image of extractImages(text)) {
      images.add(image);
      if (/^https?:\/\//.test(image)) urls.add(image);
      else if (!image.startsWith('data:')) {
        const source = decodeURIComponent(image.split(/[?#]/)[0]);
        const path = source.startsWith('/') ? join(root, 'public', source) : resolve(dirname(file), source);
        if (!existsSync(path) || !statSync(path).isFile()) failures.push(`${relative(root, file)}: missing image ${image}`);
      }
    }
  }
  const exports = htmlFiles.filter((file) => relative(dist, file) !== '404.html' && !redirects.has(file)).map((file) => {
    const page = relative(dist, file).replace(/\/index\.html$/, '').replace(/\.html$/, '');
    return page + '.md';
  });
  for (const path of exports) {
    const file = join(dist, path);
    if (!existsSync(file) || !readFileSync(file, 'utf8').trim()) failures.push(`dist/${path}: missing or empty Markdown export`);
    urls.add(new URL('/' + path, site).href);
  }
  const llmsFiles = ['llms.txt', 'llms-full.txt'];
  if (existsSync(join(dist, 'llms-small.txt'))) llmsFiles.push('llms-small.txt');
  const liveLlms = await boundedMap(llmsFiles, async (path) => {
    const local = join(dist, path);
    if (!existsSync(local) || !readFileSync(local, 'utf8').trim()) failures.push(`dist/${path}: missing or empty`);
    const url = new URL('/' + path, site).href;
    const result = await checkUrl(url);
    if (result.error) failures.push(`${url}: ${result.error}`);
    return result.text;
  });
  const listed = extractLlmsUrls(liveLlms[0] || '', site);
  if (!listed.length) failures.push('live llms.txt lists no URLs');
  // Also validate newly built index URLs before deployment.
  const localIndex = join(dist, 'llms.txt');
  if (existsSync(localIndex)) for (const url of extractLlmsUrls(readFileSync(localIndex, 'utf8'), site)) urls.add(url);
  for (const url of listed) urls.add(url);
  await boundedMap([...urls].sort(), async (url) => {
    const result = await checkUrl(url);
    if (result.error) failures.push(`${url}: ${result.error}`);
  });
  for (const failure of failures) console.error(`<3>${failure}`);
  console.log(`Nightly: ${llmsFiles.length} llms files, ${listed.length} llms URLs, ${exports.length} Markdown exports, ${links} links, ${tools.size} tools, ${commands.size} commands, ${images.size} images, ${urls.size} live URLs; ${failures.length} failures.`);
  return failures;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  runNightly().then((failures) => { process.exitCode = failures.length ? 1 : 0; }).catch(() => {
    console.error('<3>Nightly could not read built dist or generated references; run npm run build first');
    process.exitCode = 1;
  });
}
