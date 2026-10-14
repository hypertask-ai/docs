#!/usr/bin/env node
// Regression checks for the shared build/MCP MDX rules. YPER4-351.
import assert from "node:assert/strict";
import { checkMdx } from "./mdx-rules.mjs";
import { parseMdx } from "./check-mdx.mjs";

assert.deepEqual(checkMdx("---\ntitle: Test\n---\nHello {your name}"), [
  "4: {your name} is read as code; write \\{your name\\} or put it in backticks",
]);
assert.deepEqual(checkMdx('import { Aside } from "@astrojs/starlight/components";\n<Aside type="warning">Heads up</Aside>'), [
  '2: <Aside type="warning"> is not valid; use note, tip, caution or danger',
]);
assert.deepEqual(checkMdx("<Tabs>\n</Tabs>"), [
  "1: <Tabs> is used but never imported",
]);
assert.deepEqual(checkMdx(`---
title: Clean {page}
description: A clean MDX page.
---
import { Aside } from "@astrojs/starlight/components";

\`\`\`html
{braces}
<Tabs>
\`\`\`

Inline \`{code}\` stays literal.
<Aside type="note">Useful information.</Aside>
`), []);

// The full parse catches what the line rules miss. YPER4-386.
assert.deepEqual(await parseMdx("---\ntitle: Boxes: one style\n---\nHi"), [
  "2: frontmatter is not valid YAML (bad indentation of a mapping entry); quote values that contain a colon",
]);
assert.match((await parseMdx('---\ntitle: "Ok"\n---\n\n[x]({{< ref "y" >}})'))[0], /^5: MDX cannot be parsed/);
assert.deepEqual(await parseMdx('---\ntitle: "Ok: fine"\n---\nPlain text.'), []);

console.log("test-mdx-rules: ok");
