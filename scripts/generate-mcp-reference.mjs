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
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

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
      console.error(`${error.message} - retrying in ${wait / 1000}s`);
      await sleep(wait);
    }
  }
}

async function fetchTools(token) {
  const res = await fetch(SERVER, {
    method: "POST",
    signal: AbortSignal.timeout(30_000),
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
export function parseToolsPayload(body) {
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
  if (schema.enum) return schema.enum.map((v) => `\`${v}\``).join(" | ");
  if (schema.anyOf) return schema.anyOf.map(typeOf).join(" | ");
  if (schema.type === "array") return `${typeOf(schema.items ?? {})}[]`;
  return schema.type ?? "any";
}

function paramsTable(tool) {
  const schema = tool.inputSchema ?? {};
  const props = schema.properties ?? {};
  const names = Object.keys(props).sort();
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

export function render(tools) {
  const byGroup = new Map(GROUPS.map(([label]) => [label, []]));
  byGroup.set("Other", []);
  for (const tool of [...tools].sort((a, b) => a.name.localeCompare(b.name, "en"))) {
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
            ...(tool.name === "hypertask_hello" ? ["", readFileSync(new URL("./reference-notes/hello.md", import.meta.url), "utf8").trim()] : []),
            ...(tool.inputSchema?.properties?.input?.anyOf ?? []).map((variant) =>
              `\n#### Input for \`${escapeText(variant.title ?? "action")}\`\n\n${paramsTable({ inputSchema: variant })}${tool.name === "hypertask_user_context" && variant.title === "hello" ? "\n\n" + readFileSync(new URL("./reference-notes/hello.md", import.meta.url), "utf8").trim() : ""}`
            ),
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
This page is generated from the server's own \`tools/list\` response, so it cannot drift from what an agent actually gets. Start with \`hypertask_user_context\` and \`action: "hello"\` for the welcome map.
</Aside>

<Aside type="note">
Each resource tool selects an operation with \`action\`; put its fields in \`input\`. See [MCP Integration](/mcp/overview/) for connection instructions.
</Aside>

**Source:** Live MCP \`tools/list\`. Schema version \`${schemaVersion(tools)}\`.

**${tools.length} tools.**

---

${sections}
`;
}

// Machines whose IP the edge is currently challenging can pass a saved tools/list
// response instead: curl it through a clean network, then
//   node scripts/generate-mcp-reference.mjs tools.json
// A content-derived version changes only when the tool descriptions or schemas do.
function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  return value;
}
export function schemaVersion(tools) {
  return createHash("sha256").update(JSON.stringify(stable([...tools].sort((a, b) => a.name.localeCompare(b.name, "en"))))).digest("hex").slice(0, 12);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  try {
    const savedResponse = process.argv[2];
    const tools = savedResponse
      ? parseToolsPayload(readFileSync(savedResponse, "utf8"))
      : await fetchToolsWithRetry(readToken());
    writeFileSync(OUT, render(tools));
    console.log(`wrote ${OUT}: ${tools.length} tools (${schemaVersion(tools)})`);
  } catch {
    console.error("<3>MCP reference generation failed; check token and tools/list availability");
    process.exitCode = 1;
  }
}
