#!/usr/bin/env node
// Fail fast with a readable message on MDX mistakes that break `astro build`:
// bare {placeholders} outside code, <Aside> types Starlight does not know, and
// components used without an import.
// Runs before the build (see package.json "build"). YPER4-350.
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const CONTENT = join(ROOT, "src/content");
const ASIDE_TYPES = new Set(["note", "tip", "caution", "danger"]);

function* mdxFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* mdxFiles(path);
    else if (entry.name.endsWith(".mdx")) yield path;
  }
}

export function checkMdx(text) {
  const problems = [];
  const lines = text.split("\n");
  const known = new Set();
  for (const m of text.matchAll(/^(?:import|export)\s+(.*)$/gm)) {
    for (const name of m[1].match(/[A-Za-z_$][\w$]*/g) ?? []) known.add(name);
  }
  let inFence = false;
  let inFrontmatter = lines[0]?.trim() === "---";
  lines.forEach((raw, i) => {
    const n = i + 1;
    if (inFrontmatter) {
      if (i > 0 && raw.trim() === "---") inFrontmatter = false;
      return;
    }
    if (/^\s*(```|~~~)/.test(raw)) {
      inFence = !inFence;
      return;
    }
    if (inFence || /^(import|export)\s/.test(raw)) return;
    const line = raw.replace(/`+[^`]*`+/g, (s) => " ".repeat(s.length));
    for (const m of line.matchAll(/<Aside\b[^>]*\btype="([^"]*)"/g)) {
      if (!ASIDE_TYPES.has(m[1])) {
        problems.push(`${n}: <Aside type="${m[1]}"> is not valid; use note, tip, caution or danger`);
      }
    }
    for (const m of line.matchAll(/<([A-Z]\w*)[\s/>]/g)) {
      if (!known.has(m[1])) problems.push(`${n}: <${m[1]}> is used but never imported`);
    }
    for (const m of line.matchAll(/(?<![\\=])\{([^{}]*)\}/g)) {
      const body = m[1].trim();
      if (body.startsWith("/*")) continue;
      const head = body.match(/^[A-Za-z_$][\w$]*/)?.[0];
      const placeholder = /^[A-Za-z_$][\w$ .-]*$/.test(body) && !(head && known.has(head));
      if (placeholder) {
        problems.push(`${n}: {${body}} is read as code; write \\{${body}\\} or put it in backticks`);
      }
    }
  });
  return problems;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  let failed = 0;
  for (const file of mdxFiles(CONTENT)) {
    for (const problem of checkMdx(readFileSync(file, "utf8"))) {
      console.error(`${relative(ROOT, file)}:${problem}`);
      failed++;
    }
  }
  if (failed) {
    console.error(`check-mdx: ${failed} problem(s) would break the docs build.`);
    process.exit(1);
  }
  console.log("check-mdx: ok");
}
