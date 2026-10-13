#!/usr/bin/env node
// Fail fast with a readable message on MDX mistakes that break `astro build`:
// bare {placeholders} outside code, <Aside> types Starlight does not know, and
// components used without an import.
// Runs before the build (see package.json "build"). YPER4-350; shared rules: YPER4-351.
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
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
