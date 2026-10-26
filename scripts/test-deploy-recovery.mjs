import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const workflow = readFileSync(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8');
const recovery = workflow.match(/      - name: Close recovered deploy alarm\n([\s\S]*?)(?=\n      - name:|$)/);
assert.ok(recovery, 'successful deployments must resolve the failure alarm');
assert.match(recovery[1], /        if: success\(\)/);
assert.ok(workflow.indexOf(recovery[0]) > workflow.indexOf('- name: Purge Cloudflare edge cache'));
assert.match(workflow, /- name: Report a failed deploy\n        if: failure\(\)/);
const shell = recovery[1].split('        run: |\n')[1].replace(/^          /gm, '');
const dir = mkdtempSync(join(tmpdir(), 'docs-deploy-recovery-'));
try {
  writeFileSync(join(dir, 'gh'), `#!/usr/bin/env node
import { appendFileSync } from 'node:fs';
const args = process.argv.slice(2);
appendFileSync(process.env.CALLS, JSON.stringify(args) + '\\n');
if (args[0] === 'api') {
  if (process.env.API_FAIL === '1') process.exit(1);
  console.log(process.env.HEAD_SHA);
} else if (args[0] === 'issue' && args[1] === 'list') {
  if (process.env.LIST_FAIL === '1') process.exit(1);
  console.log(process.env.ISSUES);
} else if (args[0] === 'issue' && args[1] === 'close') {
  if (process.env.CLOSE_FAIL === '1') process.exit(1);
} else process.exit(2);
`, { mode: 0o755 });
  const run = (overrides = {}) => {
    const callsFile = join(dir, 'calls');
    writeFileSync(callsFile, '');
    const result = spawnSync('bash', ['-e', '-o', 'pipefail', '-c', shell], {
      encoding: 'utf8',
      env: { ...process.env, PATH: `${dir}:${process.env.PATH}`, CALLS: callsFile,
        GITHUB_REPOSITORY: 'hypertask-ai/docs', GITHUB_SHA: 'release-sha', HEAD_SHA: 'release-sha',
        RUN_URL: 'https://github.com/hypertask-ai/docs/actions/runs/123', ISSUES: '84\n91',
        API_FAIL: '', LIST_FAIL: '', CLOSE_FAIL: '', ...overrides },
    });
    return { status: result.status, calls: readFileSync(callsFile, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse) };
  };
  const success = run();
  assert.equal(success.status, 0);
  assert.deepEqual(success.calls.filter(c => c[1] === 'close').map(c => c[2]), ['84', '91']);
  for (const call of success.calls.filter(c => c[1] === 'close')) {
    assert.ok(call.includes('--comment'));
    assert.match(call.at(-1), /release-sha/);
    assert.match(call.at(-1), /https:\/\/github.com\/hypertask-ai\/docs\/actions\/runs\/123/);
  }
  const list = success.calls.find(c => c[1] === 'list');
  const query = list[list.indexOf('--jq') + 1];
  const selected = spawnSync('jq', ['-r', query], {
    input: JSON.stringify([{ number: 84, title: 'docs.hypertask.ai is not deploying' },
      { number: 99, title: 'docs.hypertask.ai is not deploying elsewhere' }]), encoding: 'utf8',
  });
  assert.equal(selected.status, 0);
  assert.equal(selected.stdout.trim(), '84');
  assert.equal(run({ ISSUES: '' }).status, 0);
  assert.equal(run({ ISSUES: '' }).calls.some(c => c[1] === 'close'), false);
  const stale = run({ HEAD_SHA: 'newer-release-sha' });
  assert.equal(stale.status, 0);
  assert.deepEqual(stale.calls.map(c => c[0]), ['api']);
  for (const name of ['API_FAIL', 'LIST_FAIL', 'CLOSE_FAIL']) {
    assert.notEqual(run({ [name]: '1' }).status, 0, `${name} must not report recovery`);
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
console.log('deploy recovery checks: all passed');
