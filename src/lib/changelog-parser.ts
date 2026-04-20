import fs from 'node:fs';
import path from 'node:path';

export interface ChangelogEntry {
  date: string;
  html: string;
}

/**
 * Parses the changelog MDX file and extracts entries grouped by date (## headings).
 * Converts markdown to simple HTML for feed consumption.
 */
export async function parseChangelogEntries(): Promise<ChangelogEntry[]> {
  const filePath = path.join(process.cwd(), 'src/content/docs/changelog/index.mdx');
  const raw = fs.readFileSync(filePath, 'utf-8');

  // Strip frontmatter
  const withoutFrontmatter = raw.replace(/^---[\s\S]*?---\s*/, '');

  // Split on ## date headings (e.g., "## March 19, 2026")
  const datePattern = /^## (.+)$/gm;
  const entries: ChangelogEntry[] = [];
  const matches = [...withoutFrontmatter.matchAll(datePattern)];

  for (let i = 0; i < matches.length; i++) {
    const dateStr = matches[i][1].trim();
    const startIndex = matches[i].index! + matches[i][0].length;
    const endIndex = i + 1 < matches.length ? matches[i + 1].index! : withoutFrontmatter.length;
    const section = withoutFrontmatter.slice(startIndex, endIndex).trim();

    // Convert markdown subset to HTML
    const html = markdownToHtml(section);
    entries.push({ date: dateStr, html });
  }

  return entries;
}

function markdownToHtml(md: string): string {
  let html = md;

  // Remove import statements and JSX components
  html = html.replace(/^import\s.+$/gm, '');
  html = html.replace(/<Aside[^>]*>|<\/Aside>/g, '');

  // ### headings -> <h3>
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');

  // **bold** -> <strong>
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // [text](url) -> <a>
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // `code` -> <code>
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // List items: - text -> <li>
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');

  // Wrap consecutive <li> in <ul>
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr/>');

  // Clean up blank lines
  html = html.replace(/\n{3,}/g, '\n\n').trim();

  return html;
}
