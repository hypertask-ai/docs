#!/usr/bin/env node
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkAgentToken } from './check-agent-token.mjs';
import { checkScheduledEnv } from './check-scheduled-env.mjs';

const jwt = (claims) => ['e30', Buffer.from(JSON.stringify(claims)).toString('base64url'), 'sig'].join('.');

assert.equal(checkAgentToken(jwt({ userId: 1, agentId: 'agent-a' }), 'agent-a'), '');
assert.equal(checkAgentToken(jwt({ userId: 1 }), 'agent-a'), 'token is not an agent login');
assert.equal(checkAgentToken(jwt({ userId: 1, agentId: 'agent-b' }), 'agent-a'), 'token belongs to a different agent');
assert.equal(checkAgentToken('not-a-jwt', 'agent-a'), 'token is not an agent login');
assert.equal(checkAgentToken('', 'agent-a'), 'DOCS_REFS_HT_TOKEN is not set');
assert.equal(checkAgentToken(jwt({ agentId: 'agent-a' }), ''), 'DOCS_REFS_AGENT_ID is not set');

const dir = mkdtempSync(join(tmpdir(), 'scheduled-env-'));
try {
  const scheduled = "on:\n  schedule:\n    - cron: '0 * * * *'\n  workflow_dispatch:\njobs:\n  a:\n    environment: scheduled-jobs\n";
  writeFileSync(join(dir, 'docs-refs.yml'), scheduled);
  writeFileSync(join(dir, 'build-check.yml'), 'on:\n  pull_request:\njobs:\n  b:\n    runs-on: ubuntu-latest\n');
  assert.deepEqual(checkScheduledEnv(dir), []);

  writeFileSync(join(dir, 'sneaky.yml'), 'on:\n  pull_request_target:\njobs:\n  c:\n    environment: scheduled-jobs\n');
  assert.deepEqual(checkScheduledEnv(dir), ['sneaky.yml names the scheduled-jobs environment; only docs-refs.yml may']);
  rmSync(join(dir, 'sneaky.yml'));

  writeFileSync(join(dir, 'docs-refs.yml'), scheduled.replace('  workflow_dispatch:', '  pull_request:'));
  assert.deepEqual(checkScheduledEnv(dir), ['docs-refs.yml must run only on schedule and workflow_dispatch']);
} finally {
  rmSync(dir, { recursive: true, force: true });
}

console.log('docs refs schedule checks: all passed');
