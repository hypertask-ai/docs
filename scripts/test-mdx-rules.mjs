#!/usr/bin/env node
// Regression checks for the shared build/MCP MDX rules. YPER4-351.
import assert from "node:assert/strict";
import { checkMdx } from "./mdx-rules.mjs";

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

console.log("test-mdx-rules: ok");
