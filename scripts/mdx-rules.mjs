// Shared, node-free MDX checks for the docs build and MCP write_page.
// Bare placeholders, invalid Aside types, and missing imports fail fast.
// Extracted from check-mdx.mjs for YPER4-351.
const ASIDE_TYPES = new Set(["note", "tip", "caution", "danger"]);

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
