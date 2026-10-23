import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import worker from "../src/index.ts";

const secret = "docs-mcp-test-secret-not-a-production-secret";
const env = {
  JWT_SECRET: secret,
  GITHUB_TOKEN: "test-pat",
  CF_PAGES_DEPLOY_HOOK: "https://deploy.example.invalid/test-hook",
  GITHUB_OWNER: "test-owner",
  GITHUB_REPO: "test-repo",
  GITHUB_BRANCH: "main",
  DOCS_BASE_PATH: "src/content/docs",
  CONFIG_FILE_PATH: "astro.config.mjs",
  DOCS_EDITOR_USER_IDS: "12",
};
const pairs = [
  { iss: "hypertask", aud: "mcp-api", sub: "editor@example.invalid" },
  { iss: "https://app.hypertask.ai", aud: "http://localhost:3001", sub: "firebase-uid" },
];
const page = "---\ntitle: Test\ndescription: Test page\n---\n\nTest content.\n";
const mutations = [
  ["write_page", { path: "test.mdx", content: page }, "PUT"],
  ["delete_page", { page: "test.mdx" }, "DELETE"],
  ["update_sidebar_config", { content: "export default {};" }, "PUT"],
  ["trigger_deploy", {}, "POST"],
];
const reads = [
  ["list_pages", {}],
  ["read_page", { page: "test.mdx" }],
  ["read_sidebar_config", {}],
];

function sign(payload, signingSecret = secret, algorithm = "HS256") {
  const header = Buffer.from(JSON.stringify({ alg: algorithm, typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac(algorithm === "HS384" ? "sha384" : "sha256", signingSecret)
    .update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${signature}`;
}

function claims(pair = pairs[0], userId = 12) {
  return { ...pair, userId, exp: Math.floor(Date.now() / 1000) + 300 };
}

function harness(t) {
  const outbound = [];
  const events = [];
  const logs = t.mock.method(console, "log", (line) => {
    assert.equal(typeof line, "string");
    events.push("audit");
  });
  t.mock.method(globalThis, "fetch", async (url, options = {}) => {
    events.push("fetch");
    const method = options.method || "GET";
    outbound.push({ url, method, body: options.body });
    if (url === env.CF_PAGES_DEPLOY_HOOK) {
      assert.equal(method, "POST");
      return Response.json({ success: true });
    }
    assert.ok(url.startsWith("https://api.github.com/repos/test-owner/test-repo/contents/"));
    assert.equal(options.headers.Authorization, "Bearer test-pat");
    if (method !== "GET") {
      assert.ok(["PUT", "DELETE"].includes(method));
      return Response.json({ content: { sha: "new-sha" } });
    }
    if (url.includes("contents/src/content/docs?")) {
      return Response.json([{ name: "test.mdx", path: "src/content/docs/test.mdx", type: "file" }]);
    }
    const content = url.includes("astro.config.mjs") ? "export default {};" : page;
    return Response.json({ content: btoa(content), sha: "existing-sha" });
  });
  return {
    outbound,
    events,
    audit: () => logs.mock.calls.map(({ arguments: args }) => {
      assert.equal(args.length, 1);
      return JSON.parse(args[0]);
    }),
  };
}

async function rpc(token, method, params, overrides = {}) {
  const response = await worker.fetch(new Request("https://docs.example.invalid/mcp", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  }), { ...env, ...overrides }, {});
  const text = await response.text();
  const data = response.headers.get("Content-Type")?.includes("text/event-stream")
    ? JSON.parse(text.split("\n").find((line) => line.startsWith("data: ")).slice(6))
    : JSON.parse(text);
  return { status: response.status, data };
}

function call(token, tool, args, overrides) {
  return rpc(token, "tools/call", { name: tool, arguments: args }, overrides);
}

for (const pair of pairs) {
  for (const [tool, args, method] of mutations) {
    test(`${pair.aud}: non-editor ${tool} is refused and audited before any fetch`, async (t) => {
      const h = harness(t);
      const result = await call(sign(claims(pair, 13)), tool, args);
      assert.equal(result.status, 200);
      assert.equal(result.data.result.isError, true);
      assert.deepEqual(result.data.result.content, [{ type: "text", text: "not a docs editor" }]);
      assert.deepEqual(h.outbound, []);
      assert.deepEqual(h.events, ["audit"]);
      assert.deepEqual(h.audit(), [{ decision: "refused", tool, userId: 13 }]);
    });

    test(`${pair.aud}: editor ${tool} is allowed and audited before any fetch`, async (t) => {
      const h = harness(t);
      const result = await call(sign(claims(pair)), tool, args, { DOCS_EDITOR_USER_IDS: " 99, 12, , 12 " });
      assert.equal(result.status, 200);
      assert.equal(result.data.error, undefined);
      assert.notEqual(result.data.result.isError, true);
      assert.deepEqual(h.audit(), [{ decision: "allowed", tool, userId: 12 }]);
      assert.equal(h.events[0], "audit");
      const writes = h.outbound.filter((request) => request.method !== "GET");
      assert.equal(writes.length, 1);
      assert.equal(writes[0].method, method);
      if (tool === "trigger_deploy") {
        assert.equal(writes[0].url, env.CF_PAGES_DEPLOY_HOOK);
      } else {
        assert.ok(writes[0].url.includes(tool === "update_sidebar_config" ? "astro.config.mjs" : "test.mdx"));
        const body = JSON.parse(writes[0].body);
        assert.equal(body.sha, "existing-sha");
        if (method === "PUT") assert.equal(atob(body.content), args.content);
      }
    });
  }

  for (const [tool, args] of reads) {
    test(`${pair.aud}: non-editor can use ${tool}`, async (t) => {
      const h = harness(t);
      const result = await call(sign(claims(pair, 13)), tool, args);
      assert.equal(result.status, 200);
      assert.equal(result.data.error, undefined);
      assert.notEqual(result.data.result.isError, true);
      assert.ok(result.data.result.content[0].text.includes(tool === "read_sidebar_config" ? "export default" : "Test"));
      assert.ok(h.outbound.length > 0);
      assert.ok(h.outbound.every(({ method }) => method === "GET"));
      assert.deepEqual(h.audit(), []);
    });
  }

  test(`${pair.aud}: all tools remain visible to non-editors`, async (t) => {
    const h = harness(t);
    const result = await rpc(sign(claims(pair, 13)), "tools/list", {});
    assert.equal(result.status, 200);
    assert.deepEqual(result.data.result.tools.map(({ name }) => name).sort(), [...mutations, ...reads].map(([name]) => name).sort());
    assert.deepEqual(h.outbound, []);
    assert.deepEqual(h.audit(), []);
  });

  test(`${pair.aud}: agent token without exp can write`, async (t) => {
    const h = harness(t);
    const payload = { ...claims(pair), agentId: "test-agent" };
    delete payload.exp;
    const result = await call(sign(payload), "write_page", mutations[0][1]);
    assert.equal(result.status, 200);
    assert.notEqual(result.data.result.isError, true);
    assert.ok(h.outbound.some(({ method }) => method === "PUT"));
  });
}

for (const editors of [undefined, "", " ", "0,-12,12x,12.0,1.2e1,+12,0xC,012,9007199254740993,Infinity"]) {
  for (const [tool, args] of mutations) {
    test(`${tool}: empty/missing/malformed editor list ${JSON.stringify(editors)} fails closed`, async (t) => {
      const h = harness(t);
      const result = await call(sign(claims()), tool, args, { DOCS_EDITOR_USER_IDS: editors });
      assert.equal(result.status, 200);
      assert.equal(result.data.result.isError, true);
      assert.deepEqual(h.outbound, []);
      assert.deepEqual(h.audit(), [{ decision: "refused", tool, userId: 12 }]);
    });
  }
}

const invalidClaims = [
  ["wrong issuer", { iss: "other-app" }],
  ["wrong audience", { aud: "other-api" }],
  ["crossed MCP issuer/OAuth audience", { iss: pairs[0].iss, aud: pairs[1].aud }],
  ["crossed OAuth issuer/MCP audience", { iss: pairs[1].iss, aud: pairs[0].aud }],
  ["missing issuer", { iss: undefined }],
  ["missing audience", { aud: undefined }],
  ["audience array not minted by app", { aud: ["mcp-api", "email-link"] }],
  ["legacy MCP audience no longer minted", { aud: "hypertasks-mcp" }],
  ["email-link token", { aud: "email-link", userId: undefined }],
  ["email-link even with userId", { aud: "email-link" }],
  ["signup verification token", { aud: "email-verification", userId: undefined }],
  ["calendar-feed token", { aud: "calendar-feed", sub: undefined }],
  ["missing subject", { sub: undefined }],
  ["empty subject", { sub: "" }],
  ["whitespace subject", { sub: "  " }],
  ["numeric subject", { sub: 12 }],
  ["string userId", { userId: "12" }],
  ["zero userId", { userId: 0 }],
  ["negative userId", { userId: -12 }],
  ["fractional userId", { userId: 12.5 }],
  ["unsafe userId", { userId: Number.MAX_SAFE_INTEGER + 1 }],
  ["null userId", { userId: null }],
  ["expired token", { exp: Math.floor(Date.now() / 1000) - 1 }],
  ["invalid exp", { exp: "tomorrow" }],
  ["future nbf", { nbf: Math.floor(Date.now() / 1000) + 300 }],
];
for (const [label, overrides] of invalidClaims) {
  test(`${label} is 401 before any tool or outbound fetch`, async (t) => {
    const h = harness(t);
    const result = await call(sign({ ...claims(), ...overrides }), "write_page", mutations[0][1]);
    assert.equal(result.status, 401);
    assert.equal(result.data.error.code, -32001);
    assert.deepEqual(h.outbound, []);
    assert.deepEqual(h.audit(), []);
  });
}

for (const [tool, args] of mutations) {
  test(`missing userId cannot reach ${tool}`, async (t) => {
    const h = harness(t);
    const payload = claims();
    delete payload.userId;
    const result = await call(sign(payload), tool, args);
    assert.equal(result.status, 401);
    assert.deepEqual(h.outbound, []);
    assert.deepEqual(h.audit(), []);
  });
}

for (const [label, token] of [
  ["invalid signature", sign(claims(), "wrong-test-secret")],
  ["unexpected algorithm", sign(claims(), secret, "HS384")],
  ["malformed JWT", "not-a-jwt"],
]) {
  test(`${label} is 401`, async (t) => {
    const h = harness(t);
    const result = await call(token, "trigger_deploy", {});
    assert.equal(result.status, 401);
    assert.deepEqual(h.outbound, []);
    assert.deepEqual(h.audit(), []);
  });
}

test("authorization precedes MDX validation and deploy configuration checks", async (t) => {
  const h = harness(t);
  const token = sign(claims(pairs[0], 13));
  const write = await call(token, "write_page", { path: "bad.mdx", content: "<Unimported>{bad}" });
  const deploy = await call(token, "trigger_deploy", {}, { CF_PAGES_DEPLOY_HOOK: "" });
  for (const response of [write, deploy]) {
    assert.equal(response.data.result.isError, true);
    assert.equal(response.data.result.content[0].text, "not a docs editor");
  }
  assert.deepEqual(h.outbound, []);
  assert.deepEqual(h.audit(), [
    { decision: "refused", tool: "write_page", userId: 13 },
    { decision: "refused", tool: "trigger_deploy", userId: 13 },
  ]);
});
