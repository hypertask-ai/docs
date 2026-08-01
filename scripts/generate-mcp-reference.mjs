#!/usr/bin/env node
// Regenerate src/content/docs/api/tools-reference.mdx from the live MCP server.
//
// The hand-written version drifted badly: by August 2026 it listed 17 tools the
// server did not have and missed 22 it did. tools/list already returns every
// name, description and schema, so read it instead of retyping it.
//
//   HYPERTASK_MCP_TOKEN=... node scripts/generate-mcp-reference.mjs
//
// Without the env var the token is read from ~/.hypertask/config.json (written by
// `hypertask login`).

import { readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SERVER = process.env.HYPERTASK_MCP_URL ?? "https://mcp.hypertask.ai/mcp";
const OUT = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "src/content/docs/api/tools-reference.mdx"
);

// Tools are grouped by the first pattern that matches their name. Anything that
// matches nothing lands in "Other", which is the signal to add a group here.
const GROUPS = [
  ["Getting started", /^hypertask_hello$/],
  ["Context and projects", /(user_context|projects|project_members|create_board|create_label)/],
  ["Comments", /comment/],
  ["Tasks", /(_tasks?$|create_task|update_task|assign_user|move_task|attach_files|link_tasks)/],
  ["Agent coordination", /(agent_presence|board_manifest|board_playbook|decision_request|task_context)/],
  ["Drafts", /draft/],
  ["Pages", /page/],
  ["Sections", /section/],
  ["Views", /view/],
  ["Skills", /skill/],
  ["Inbox", /inbox/],
  ["Time tracking", /time/],
];

function readToken() {
  if (process.env.HYPERTASK_MCP_TOKEN) return process.env.HYPERTASK_MCP_TOKEN;
  const config = JSON.parse(
    readFileSync(join(homedir(), ".hypertask", "config.json"), "utf8")
  );
  if (!config.token) throw new Error("no token in ~/.hypertask/config.json");
  return config.token;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// The edge answers a bot challenge to unfamiliar IPs in bursts. It clears on its
// own, so retry rather than treating a 403 as a broken token.
async function fetchToolsWithRetry(token, attempts = 4) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fetchTools(token);
    } catch (error) {
      if (attempt >= attempts || !/returned (403|429|50\d)/.test(error.message)) throw error;
      const wait = attempt * 15_000;
      console.error(`${error.message} — retrying in ${wait / 1000}s`);
      await sleep(wait);
    }
  }
}

async function fetchTools(token) {
  const res = await fetch(SERVER, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      // Without a browser-shaped agent string the edge answers a bot challenge
      // instead of the tool list.
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list" }),
  });
  if (!res.ok) throw new Error(`tools/list returned ${res.status}`);

  return parseToolsPayload(await res.text());
}

// The server answers over SSE even for a single response.
function parseToolsPayload(body) {
  const payload = body.trimStart().startsWith("{")
    ? body
    : body.split("\n").find((line) => line.startsWith("data: "))?.slice(6);
  if (!payload) throw new Error("no data frame in the tools/list response");

  const tools = JSON.parse(payload)?.result?.tools;
  if (!Array.isArray(tools) || tools.length === 0) {
    throw new Error("tools/list returned no tools");
  }
  return tools;
}

// MDX reads bare < and { as JSX, and | splits a table cell. Descriptions are
// written by whoever added the tool, so assume none of it is safe.
const escapeText = (s = "") =>
  String(s).replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\{/g, "&#123;");
const escapeCell = (s = "") => escapeText(s).replace(/\|/g, "\\|").replace(/\n+/g, " ").trim();

function typeOf(schema = {}) {
  if (schema.enum) return schema.enum.map((v) => `\`${v}\``).join(" \\| ");
  if (schema.anyOf) return schema.anyOf.map(typeOf).join(" \\| ");
  if (schema.type === "array") return `${typeOf(schema.items ?? {})}[]`;
  return schema.type ?? "any";
}

function paramsTable(tool) {
  const schema = tool.inputSchema ?? {};
  const props = schema.properties ?? {};
  const names = Object.keys(props);
  if (names.length === 0) return "_Takes no parameters._";

  const required = new Set(schema.required ?? []);
  const rows = names.map((name) => {
    const p = props[name];
    const fallback = p.default === undefined ? "" : ` Defaults to \`${p.default}\`.`;
    return `| \`${name}\` | ${escapeCell(typeOf(p))} | ${required.has(name) ? "Yes" : "No"} | ${escapeCell((p.description ?? "") + fallback)} |`;
  });

  return [
    "| Parameter | Type | Required | Description |",
    "|-----------|------|----------|-------------|",
    ...rows,
  ].join("\n");
}

function groupOf(name) {
  return GROUPS.find(([, pattern]) => pattern.test(name))?.[0] ?? "Other";
}

function render(tools) {
  const byGroup = new Map(GROUPS.map(([label]) => [label, []]));
  byGroup.set("Other", []);
  for (const tool of [...tools].sort((a, b) => a.name.localeCompare(b.name))) {
    byGroup.get(groupOf(tool.name)).push(tool);
  }

  const sections = [...byGroup]
    .filter(([, group]) => group.length > 0)
    .map(([label, group]) => {
      const body = group
        .map((tool) =>
          [
            `### \`${tool.name}\``,
            "",
            escapeText(tool.description ?? ""),
            "",
            paramsTable(tool),
          ].join("\n")
        )
        .join("\n\n");
      return `## ${label}\n\n${body}`;
    })
    .join("\n\n---\n\n");

  return `---
title: MCP Tools Reference
description: Every tool the Hypertask MCP server exposes, with its parameters.
---

import { Aside } from '@astrojs/starlight/components';

{/* Generated by scripts/generate-mcp-reference.mjs from the live tools/list response. Do not edit by hand. */}

Every tool the Hypertask MCP server exposes at \`https://mcp.hypertask.ai/mcp\`, with its parameters. Requests need a \`Bearer\` token in the \`Authorization\` header.

<Aside type="tip">
This page is generated from the server's own \`tools/list\` response, so it cannot drift from what an agent actually gets. Call \`hypertask_hello\` first — it returns a welcome map of the whole surface.
</Aside>

<Aside type="note">
AI Chat inside the app exposes its own, mostly overlapping set of tools. It can write too, but it does not have the skills, task-relation or agent-coordination tools, and it splits some of these into separate tools. See [MCP Integration](/mcp/overview/) for the differences.
</Aside>

**${tools.length} tools.**

---

${sections}
`;
}

// Machines whose IP the edge is currently challenging can pass a saved tools/list
// response instead: curl it through a clean network, then
//   node scripts/generate-mcp-reference.mjs tools.json
const savedResponse = process.argv[2];
const tools = savedResponse
  ? parseToolsPayload(readFileSync(savedResponse, "utf8"))
  : await fetchToolsWithRetry(readToken());
writeFileSync(OUT, render(tools));
console.log(`wrote ${OUT} — ${tools.length} tools`);
