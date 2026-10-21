#!/usr/bin/env node
// The scheduled-jobs environment holds the docs refs agent login and push key.
// Only the scheduled workflow may name it, so no pull request job can reach them.

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const ALLOWED = 'docs-refs.yml';

export function workflowsNamingEnv(dir) {
  return readdirSync(dir)
    .filter((name) => /\.ya?ml$/.test(name))
    .filter((name) => /scheduled-jobs/.test(readFileSync(join(dir, name), 'utf8')));
}

export function checkScheduledEnv(dir) {
  const problems = workflowsNamingEnv(dir)
    .filter((name) => name !== ALLOWED)
    .map((name) => `${name} names the scheduled-jobs environment; only ${ALLOWED} may`);
  const allowed = readFileSync(join(dir, ALLOWED), 'utf8');
  if (/^\s*(pull_request|pull_request_target|workflow_call|workflow_run|repository_dispatch)\s*:/m.test(allowed)) {
    problems.push(`${ALLOWED} must run only on schedule and workflow_dispatch`);
  }
  return problems;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const problems = checkScheduledEnv(new URL('../.github/workflows/', import.meta.url).pathname);
  for (const problem of problems) console.error(problem);
  if (problems.length) process.exit(1);
  console.log('scheduled-jobs environment is used only by the scheduled workflow');
}
