#!/usr/bin/env node
// Refuse to run the scheduled refresh unless its token is this job's own agent
// login: a personal login has no agentId, a borrowed agent has a different one.
// Prints only the outcome, never the token or its claims.

export function agentIdOf(token) {
  const part = String(token ?? '').split('.')[1];
  if (!part) return '';
  try {
    const claims = JSON.parse(Buffer.from(part, 'base64url').toString('utf8'));
    return typeof claims.agentId === 'string' ? claims.agentId : '';
  } catch {
    return '';
  }
}

export function checkAgentToken(token, expected) {
  if (!expected) return 'DOCS_REFS_AGENT_ID is not set';
  if (!token) return 'DOCS_REFS_HT_TOKEN is not set';
  const actual = agentIdOf(token);
  if (!actual) return 'token is not an agent login';
  if (actual !== expected) return 'token belongs to a different agent';
  return '';
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const problem = checkAgentToken(process.env.HYPERTASK_MCP_TOKEN, process.env.EXPECTED_AGENT_ID);
  if (problem) {
    console.error(`agent login check failed: ${problem}`);
    process.exit(1);
  }
  console.log('agent login check passed');
}
