#!/usr/bin/env node
// Fail fast with a readable message on MDX mistakes that break `astro build`:
// bare {placeholders} outside code, <Aside> types Starlight does not know, and
// components used without an import. Then it parses the frontmatter and the MDX
// itself, so anything else Astro would choke on also fails here with file:line.
// Runs before the build (see package.json "build"). YPER4-350; shared rules: YPER4-351;
// full parse: YPER4-386.
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { compile } from "@mdx-js/mdx";
import yaml from "js-yaml";
import { checkMdx } from "./mdx-rules.mjs";

const ROOT = new URL("..", import.meta.url).pathname;
const CONTENT = join(ROOT, "src/content");

function* mdxFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* mdxFiles(path);
    else if (entry.name.endsWith(".mdx")) yield path;
  }
}

// What Astro itself parses: YAML frontmatter, then MDX, with the packages it uses.
export async function parseMdx(text) {
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  let body = text;
  if (fm) {
    try {
      yaml.load(fm[1]);
    } catch (e) {
      return [`${(e.mark?.line ?? 0) + 2}: frontmatter is not valid YAML (${e.reason}); quote values that contain a colon`];
    }
    // Blank lines keep MDX line numbers equal to file line numbers.
    body = "\n".repeat(fm[0].split("\n").length - 1) + text.slice(fm[0].length);
  }
  try {
    await compile(body);
  } catch (e) {
    return [`${e.line ?? 1}: MDX cannot be parsed (${e.reason ?? e.message})`];
  }
  return [];
}

if (import.meta.url === `file://${process.argv[1]}`) {
  let failed = 0;
  for (const file of mdxFiles(CONTENT)) {
    const text = readFileSync(file, "utf8");
    const problems = checkMdx(text);
    if (!problems.length) problems.push(...(await parseMdx(text)));
    for (const problem of problems) {
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
