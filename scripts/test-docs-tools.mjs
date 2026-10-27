#!/usr/bin/env node
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { createServer } from 'node:http';
import { execFileSync } from 'node:child_process';
import { chmodSync } from 'node:fs';
import { parseHelpCommands, catalogPaths, walkHelp, renderCliReference } from './generate-cli-reference.mjs';
import { parseToolsPayload, render, schemaVersion } from './generate-mcp-reference.mjs';
import { parseMdx } from './check-mdx.mjs';
import { checkMdx } from './mdx-rules.mjs';
import { extractLinks, localLinkFile, extractToolNames, unknownCliMentions, extractImages, extractLlmsUrls, boundedMap, checkUrl, runNightly } from './docs-nightly.mjs';

const fixture = (name) => readFileSync(new URL(`./fixtures/docs-tools/${name}`, import.meta.url), 'utf8');
assert.deepEqual(parseHelpCommands(fixture('root-help.txt')), ['project', 'status', 'task']);
assert.deepEqual(parseHelpCommands(fixture('task-help.txt')), ['get', 'list']);
assert.deepEqual(parseHelpCommands('Usage: hypertask\nRun capabilities --json'), []);
assert.deepEqual(catalogPaths({ commands: [{ name: 'task', commands: [{ name: 'list' }] }] }), [['task'], ['task', 'list']]);
const seen = [];
const entries = walkHelp((path) => { seen.push(path.join(' ')); return path.length === 0 ? fixture('root-help.txt') : path.join(' ') === 'task' ? fixture('task-help.txt') : 'Usage: hypertask ' + path.join(' '); }, [['status']]);
assert.equal(seen.length, 6);
assert.equal(new Set(seen).size, seen.length);
assert.throws(() => walkHelp(() => ''), /empty help/);
const cli = renderCliReference(entries, '0.2.17');
assert.equal(cli, renderCliReference(entries, '0.2.17'));
assert.notEqual(cli, renderCliReference(entries, '0.2.18'));
assert.deepEqual(checkMdx(cli), []);
assert.deepEqual(await parseMdx(cli), []);
assert.deepEqual(await parseMdx(renderCliReference([{ path: [], help: 'literal ``` {value} <tag> |' }], 'test')), []);
const login = renderCliReference([{ path: ['login'], help: 'Usage: hypertask login' }], 'test');
assert.ok(login.includes('### Guided start after token login'));
for (const field of ['signedInAs', 'configPath', 'moreBoards']) assert.ok(login.includes(field));
assert.deepEqual(await parseMdx(login), []);
assert.ok(!cli.includes('### Guided start after token login'));
const tools = parseToolsPayload(fixture('tools.json'));
assert.deepEqual(parseToolsPayload('data: ' + fixture('tools.json')), tools);
assert.throws(() => parseToolsPayload('{}'), /no tools/);
assert.throws(() => parseToolsPayload('event: empty'), /no data/);
const mcp = render(tools);
assert.equal(mcp, render([...tools].reverse()));
assert.equal(schemaVersion(tools), schemaVersion([...tools].reverse()));
assert.notEqual(schemaVersion(tools), schemaVersion([...tools, { name: 'hypertask_new' }]));
assert.deepEqual(checkMdx(mcp), []);
assert.deepEqual(await parseMdx(mcp), []);
for (const tool of [
  { name: 'hypertask_hello' },
  { name: 'hypertask_user_context', inputSchema: { properties: { input: { anyOf: [{ title: 'hello' }, { title: 'get' }] } } } },
]) {
  const hello = render([tool]);
  assert.equal(hello.split('##### Hello guided start').length, 2);
  for (const field of ['displayName', 'startBoard', 'boardUrl', 'project_id', 'hypertask_get_board_playbook']) assert.ok(hello.includes(field));
  assert.deepEqual(await parseMdx(hello), []);
}
assert.ok(!render([{ name: 'hypertask_other' }]).includes('##### Hello guided start'));
assert.ok(!render([{ name: 'hypertask_user_context', inputSchema: { properties: { input: { anyOf: [{ title: 'get' }] } } } }]).includes('##### Hello guided start'));
assert.deepEqual(extractLinks(fixture('links.html')), ['/style.css', '/features/tasks/?a=1&b=2#top', '../boards/', 'https://example.com/', 'mailto:a@example.com', '#self']);
assert.deepEqual(extractToolNames('`hypertask_tasks` hypertask_tasks hypertask_missing @hypertask/hypertask_cli hypertask_cli'), ['hypertask_tasks', 'hypertask_missing']);
const onboarding = readFileSync(new URL('../src/content/docs/connect-an-agent.mdx', import.meta.url), 'utf8');
const currentReference = readFileSync(new URL('../src/content/docs/api/tools-reference.mdx', import.meta.url), 'utf8');
const currentTools = new Set([...currentReference.matchAll(/^### `([^`]+)`/gm)].map((match) => match[1]));
assert.ok(currentTools.size > 0);
assert.ok(extractToolNames(onboarding).includes('hypertask_user_context'));
for (const name of extractToolNames(onboarding)) assert.ok(currentTools.has(name), `connect-an-agent.mdx: unknown tool ${name}`);
const commands = new Set(['task', 'task list', 'task get', 'login']);
assert.deepEqual(unknownCliMentions('`hypertask tasks list --limit 1`\n```sh\nhypertask task get abc\n```\n`claude mcp add hypertask https://mcp.example.com`', commands), []);
assert.deepEqual(unknownCliMentions('`hypertask task typo` `hypertask nonexistent`', commands), ['task typo', 'nonexistent']);
assert.deepEqual(extractImages('![one](/one.png) ![two][pic]\n[pic]: /two.png\n<img src="/three.png">\nimport shot from "./four.png"\n<Image src={shot}/>'), ['/one.png', '/two.png', '/three.png', './four.png']);
assert.deepEqual(extractImages('![shortcut]\n[shortcut]: /shortcut.png\n<Image src={"/literal.png"}/>'), ['/shortcut.png', '/literal.png']);
assert.deepEqual(unknownCliMentions('### hypertask task typo\n<code>hypertask missing</code>', commands), ['task typo', 'missing']);
assert.deepEqual(extractImages('![missing][lost]'), ['missing-reference:lost']);
assert.deepEqual(extractLlmsUrls('- [A](/a/)\n- [A](/a/)\n- [B](https://example.com/b)'), ['https://docs.hypertask.ai/a/', 'https://example.com/b']);
let active = 0, peak = 0;
const mapped = await boundedMap(Array.from({ length: 20 }, (_, i) => i), async (n) => { active++; peak = Math.max(peak, active); await new Promise(setImmediate); active--; return n * 2; });
assert.equal(peak, 6);
assert.deepEqual(mapped, Array.from({ length: 20 }, (_, i) => i * 2));

const root = mkdtempSync(join(tmpdir(), 'docs-tools-test-'));
const server = createServer((request, response) => {
  if (request.url === '/missing') { response.writeHead(404); response.end(); }
  else if (request.url === '/empty') response.end('');
  else if (request.url === '/llms.txt') response.end('- [A](/a/)');
  else response.end('content');
});
await new Promise((done) => server.listen(0, '127.0.0.1', done));
const site = `http://127.0.0.1:${server.address().port}`;
try {
  for (const dir of ['dist/a', 'dist/old', 'src/content/docs/api', 'src/content/docs/cli', 'src/content/changelog']) mkdirSync(join(root, dir), { recursive: true });
  const put = (path, text) => writeFileSync(join(root, path), text);
  put('dist/a/index.html', '<a href="/a/">A</a>');
  put('dist/a.md', '# A');
  put('dist/404.html', '<link href="/404/">');
  put('dist/llms.txt', '- [A](/a/)');
  put('dist/llms-full.txt', 'full content');
  put('src/content/docs/api/tools-reference.mdx', '### `hypertask_tasks`');
  put('src/content/docs/cli/commands.mdx', '## `hypertask task`\n## `hypertask task list`');
  put('src/content/docs/a.mdx', '`hypertask_tasks` `hypertask tasks list`');
  assert.ok(localLinkFile('/a/?x=1#anchor', join(root, 'dist/a/index.html'), join(root, 'dist'), site));
  assert.ok(localLinkFile('/404/', join(root, 'dist/a/index.html'), join(root, 'dist'), site));
  assert.equal(localLinkFile('/absent/', join(root, 'dist/a/index.html'), join(root, 'dist'), site), '');
  assert.equal(localLinkFile('https://elsewhere.test/', join(root, 'dist/a/index.html'), join(root, 'dist'), site), null);
  assert.equal((await checkUrl(site + '/missing')).error, 'HTTP 404');
  assert.equal((await checkUrl(site + '/empty')).error, 'empty response');
  put('dist/old/index.html', '<!doctype html><meta http-equiv="refresh" content="0;url=/a/"><link rel="canonical" href="' + site + '/a/"><a href="/a/">Moved</a>');
  assert.deepEqual(await runNightly(root, site), []);
  put('dist/old/index.html', '<meta http-equiv="refresh" content="0;url=/absent/"><a href="/absent/">Moved</a>');
  assert.ok((await runNightly(root, site)).some((failure) => failure.includes('broken link /absent/')));
  put('dist/old/index.html', '<meta http-equiv="refresh" content="0;url=/a/"><a href="/a/">Moved</a>');
  put('dist/a/index.html', '<a href="/absent/">Bad</a>');
  put('src/content/docs/a.mdx', '`hypertask_missing` `hypertask task typo` ![bad](/absent.png)');
  put('dist/a.md', '');
  const failures = await runNightly(root, site);
  for (const pattern of ['broken link', 'unknown tool', 'unknown CLI', 'missing image', 'empty Markdown']) assert.ok(failures.some((f) => f.includes(pattern)), pattern);
} finally {
  await new Promise((done) => server.close(done));
  rmSync(root, { recursive: true, force: true });
}
// Exercise refresh control flow with fake executables. No real Git writes,
// key-safe reads, package installs or timer changes occur in this test.
const home = mkdtempSync(join(tmpdir(), 'docs-refresh-test-'));
try {
  const bin = join(home, '.local/bin');
  mkdirSync(bin, { recursive: true });
  const trace = join(home, 'trace');
  const executable = (name, body) => {
    const path = join(bin, name);
    writeFileSync(path, '#!/usr/bin/env bash\nset -euo pipefail\n' + body + '\n');
    chmodSync(path, 0o700);
  };
  executable('git', `printf 'git %s\\n' "$*" >> "$TRACE"
if [[ "$1" == clone ]]; then
  dest="\${@: -1}"
  mkdir -p "$dest/.git" "$dest/scripts"
  printf 'fixture-lock' > "$dest/package-lock.json"
  printf 'console.log("nightly fixture passed");' > "$dest/scripts/docs-nightly.mjs"
fi
if [[ "$1" == diff ]]; then exit "\${CHANGED:-0}"; fi
if [[ " $* " == *" commit "* && " $* " != *" user.email="* ]]; then
  echo "fatal: unable to auto-detect email address" >&2
  exit 128
fi`);
  executable('stack-key', 'printf "fixture-token-not-a-secret\\n"');
  executable('npm', `printf 'npm %s\\n' "$*" >> "$TRACE"
if [[ "$*" == ci ]]; then mkdir -p node_modules; fi
if [[ "$*" == 'run refs' ]]; then [[ "\${HYPERTASK_MCP_TOKEN:-}" == fixture-token-not-a-secret ]]; fi
if [[ "$*" == 'run build' ]]; then
  [[ -z "\${HYPERTASK_MCP_TOKEN:-}" ]]
  exit "\${FAIL_BUILD:-0}"
fi`);
  const refresh = fileURLToPath(new URL('./docs-refresh.sh', import.meta.url));
  const run = (args = [], extra = {}) => execFileSync('/bin/bash', [refresh, ...args], { encoding: 'utf8', env: { ...process.env, HOME: home, TRACE: trace, HYPERTASK_MCP_TOKEN: '', ...extra } });
  run();
  let log = readFileSync(trace, 'utf8');
  assert.ok(log.includes('git clone --branch main --single-branch git@github.com:hypertask-ai/docs.git'));
  assert.ok(log.includes('git merge --ff-only origin/main'));
  assert.ok(log.includes('npm ci'));
  assert.ok(!log.includes('git commit') && !log.includes('git push'));
  writeFileSync(trace, '');
  run([], { CHANGED: '1' });
  log = readFileSync(trace, 'utf8');
  assert.ok(!log.includes('npm ci'));
  assert.ok(log.includes('git -c user.name=Hypertask docs refs -c user.email=docs-refs@hypertask.ai commit -m docs: refresh generated MCP and CLI references'));
  assert.ok(log.includes('git push origin HEAD:main'));
  writeFileSync(trace, '');
  writeFileSync(join(home, '.local/state/docs-refs/repo/package-lock.json'), 'new-fixture-lock');
  run();
  assert.ok(readFileSync(trace, 'utf8').includes('npm ci'));
  writeFileSync(trace, '');
  assert.ok(run(['--nightly']).includes('nightly fixture passed'));
  log = readFileSync(trace, 'utf8');
  assert.ok(log.includes('npm run build') && !log.includes('run refs') && !log.includes('git fetch'));
  assert.throws(() => run([], { FAIL_BUILD: '1' }), (error) => error.status === 1 && error.stderr.includes('<6>docs-refs failed during build') && !error.stderr.includes('<3>docs-refs failed') && !error.stderr.includes('fixture-token-not-a-secret'));
  const arbitrary = join(home, 'developer-repo');
  mkdirSync(join(arbitrary, '.git'), { recursive: true });
  assert.throws(() => run([], { DOCS_REFS_REPO: arbitrary }), (error) => error.status === 1 && error.stderr.includes('dedicated automation clone'));
  for (const service of ['docs-refs', 'docs-nightly']) {
    const unit = readFileSync(new URL(`./systemd/${service}.service`, import.meta.url), 'utf8');
    assert.ok(unit.includes('SyslogLevelPrefix=yes') && unit.includes('StandardError=journal'));
    const timer = readFileSync(new URL(`./systemd/${service}.timer`, import.meta.url), 'utf8');
    assert.ok(timer.includes('Persistent=true'));
    assert.ok(timer.includes(service === 'docs-refs' ? '*:00,30:00 UTC' : '03:30:00 UTC'));
  }
} finally {
  rmSync(home, { recursive: true, force: true });
}
console.log('docs tools tests passed');
