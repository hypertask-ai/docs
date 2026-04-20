import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";
import { jwtVerify } from "jose";

interface Env {
  GITHUB_TOKEN: string;
  JWT_SECRET: string;
  CF_PAGES_DEPLOY_HOOK: string;
  GITHUB_OWNER: string;
  GITHUB_REPO: string;
  GITHUB_BRANCH: string;
  DOCS_BASE_PATH: string;
  CONFIG_FILE_PATH: string;
}

// --- GitHub API helpers ---

interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  type: "file" | "dir";
  download_url: string | null;
}

interface GitHubContentResponse {
  name: string;
  path: string;
  sha: string;
  content: string;
  encoding: string;
}

async function githubApi(
  env: Env,
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/${path}`;
  return fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "hypertask-docs-mcp",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
}

async function listDocsRecursive(
  env: Env,
  dir: string = env.DOCS_BASE_PATH
): Promise<{ path: string; slug: string; title: string; description: string }[]> {
  const res = await githubApi(env, `contents/${dir}?ref=${env.GITHUB_BRANCH}`);
  if (!res.ok) throw new Error(`GitHub API error listing ${dir}: ${res.status}`);

  const items: GitHubFile[] = (await res.json()) as GitHubFile[];
  const pages: { path: string; slug: string; title: string; description: string }[] = [];

  for (const item of items) {
    if (item.type === "dir") {
      const subPages = await listDocsRecursive(env, item.path);
      pages.push(...subPages);
    } else if (item.name.endsWith(".md") || item.name.endsWith(".mdx")) {
      const fileRes = await githubApi(env, `contents/${item.path}?ref=${env.GITHUB_BRANCH}`);
      if (!fileRes.ok) continue;
      const fileData = (await fileRes.json()) as GitHubContentResponse;
      const content = atob(fileData.content.replace(/\n/g, ""));

      const titleMatch = content.match(/^title:\s*(.+)$/m);
      const descMatch = content.match(/^description:\s*(.+)$/m);
      const relPath = item.path.replace(`${env.DOCS_BASE_PATH}/`, "");

      pages.push({
        path: relPath,
        slug: relPath.replace(/\.(mdx?|md)$/, ""),
        title: titleMatch ? titleMatch[1].replace(/^["']|["']$/g, "") : item.name,
        description: descMatch ? descMatch[1].replace(/^["']|["']$/g, "") : "",
      });
    }
  }

  return pages;
}

async function readFileFromGithub(
  env: Env,
  filePath: string
): Promise<{ content: string; sha: string } | null> {
  const fullPath = `${env.DOCS_BASE_PATH}/${filePath}`;
  const res = await githubApi(env, `contents/${fullPath}?ref=${env.GITHUB_BRANCH}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

  const data = (await res.json()) as GitHubContentResponse;
  const content = atob(data.content.replace(/\n/g, ""));
  return { content, sha: data.sha };
}

async function readRepoFile(
  env: Env,
  filePath: string
): Promise<{ content: string; sha: string } | null> {
  const res = await githubApi(env, `contents/${filePath}?ref=${env.GITHUB_BRANCH}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

  const data = (await res.json()) as GitHubContentResponse;
  const content = atob(data.content.replace(/\n/g, ""));
  return { content, sha: data.sha };
}

async function writeFileToGithub(
  env: Env,
  filePath: string,
  content: string,
  message: string
): Promise<{ created: boolean }> {
  const fullPath = `${env.DOCS_BASE_PATH}/${filePath}`;

  // Check if file exists to get SHA
  const existing = await githubApi(env, `contents/${fullPath}?ref=${env.GITHUB_BRANCH}`);
  let sha: string | undefined;
  if (existing.ok) {
    const data = (await existing.json()) as GitHubContentResponse;
    sha = data.sha;
  }

  const body: Record<string, string> = {
    message,
    content: btoa(unescape(encodeURIComponent(content))),
    branch: env.GITHUB_BRANCH,
  };
  if (sha) body.sha = sha;

  const res = await githubApi(env, `contents/${fullPath}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub write failed (${res.status}): ${err}`);
  }

  return { created: !sha };
}

async function writeRepoFile(
  env: Env,
  filePath: string,
  content: string,
  message: string
): Promise<void> {
  const existing = await githubApi(env, `contents/${filePath}?ref=${env.GITHUB_BRANCH}`);
  let sha: string | undefined;
  if (existing.ok) {
    const data = (await existing.json()) as GitHubContentResponse;
    sha = data.sha;
  }

  const body: Record<string, string> = {
    message,
    content: btoa(unescape(encodeURIComponent(content))),
    branch: env.GITHUB_BRANCH,
  };
  if (sha) body.sha = sha;

  const res = await githubApi(env, `contents/${filePath}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub write failed (${res.status}): ${err}`);
  }
}

async function deleteFileFromGithub(
  env: Env,
  filePath: string,
  message: string
): Promise<boolean> {
  const fullPath = `${env.DOCS_BASE_PATH}/${filePath}`;

  const existing = await githubApi(env, `contents/${fullPath}?ref=${env.GITHUB_BRANCH}`);
  if (existing.status === 404) return false;
  if (!existing.ok) throw new Error(`GitHub API error: ${existing.status}`);

  const data = (await existing.json()) as GitHubContentResponse;

  const res = await githubApi(env, `contents/${fullPath}`, {
    method: "DELETE",
    body: JSON.stringify({
      message,
      sha: data.sha,
      branch: env.GITHUB_BRANCH,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub delete failed (${res.status}): ${err}`);
  }

  return true;
}

async function resolvePagePath(
  env: Env,
  pageSlug: string
): Promise<string | null> {
  // Try exact match
  const exactRes = await githubApi(
    env,
    `contents/${env.DOCS_BASE_PATH}/${pageSlug}?ref=${env.GITHUB_BRANCH}`
  );
  if (exactRes.ok) return pageSlug;

  // Try with extensions
  const slug = pageSlug.replace(/\.(mdx?|md)$/, "");
  for (const ext of [".mdx", ".md"]) {
    const res = await githubApi(
      env,
      `contents/${env.DOCS_BASE_PATH}/${slug}${ext}?ref=${env.GITHUB_BRANCH}`
    );
    if (res.ok) return `${slug}${ext}`;
  }

  return null;
}

// --- JWT validation ---

async function validateJwt(
  token: string,
  secret: string
): Promise<{ sub: string; email?: string }> {
  const secretKey = new TextEncoder().encode(secret);
  const { payload } = await jwtVerify(token, secretKey);
  return {
    sub: payload.sub as string,
    email: (payload as Record<string, unknown>).email as string | undefined,
  };
}

// --- Build MCP Server ---

function createMcpServer(env: Env): McpServer {
  const server = new McpServer({
    name: "hypertask-docs",
    version: "1.0.0",
  });

  // Tool: list_pages
  server.tool(
    "list_pages",
    "List all documentation pages with their paths, titles, and descriptions",
    {},
    async () => {
      const pages = await listDocsRecursive(env);
      return {
        content: [{ type: "text", text: JSON.stringify(pages, null, 2) }],
      };
    }
  );

  // Tool: read_page
  server.tool(
    "read_page",
    "Read the full MDX content of a documentation page by slug or path (e.g. 'features/ai-features' or 'getting-started/quickstart.mdx')",
    {
      page: z
        .string()
        .describe("Page slug or file path, e.g. 'features/ai-features'"),
    },
    async ({ page }) => {
      const resolved = await resolvePagePath(env, page);
      if (!resolved) {
        return {
          content: [
            {
              type: "text",
              text: `Error: Page '${page}' not found. Use list_pages to see available pages.`,
            },
          ],
        };
      }
      const file = await readFileFromGithub(env, resolved);
      if (!file) {
        return {
          content: [
            { type: "text", text: `Error: Could not read '${resolved}'.` },
          ],
        };
      }
      return {
        content: [{ type: "text", text: file.content }],
      };
    }
  );

  // Tool: write_page
  server.tool(
    "write_page",
    `Create or update a documentation page. Provide the full MDX content including frontmatter.

Rules:
- Path should be relative to docs dir, e.g. 'features/new-feature.mdx'
- Files using Starlight components (Aside, Tabs, Card, etc.) MUST use .mdx extension
- Frontmatter must include 'title' and 'description'
- Use HTML in code examples (Hypertask API uses HTML, not Markdown)
- Available Starlight components: Aside, Tabs, TabItem, Steps, Card, CardGrid, LinkCard

Example frontmatter:
---
title: My Page Title
description: Short description for SEO.
---`,
    {
      path: z
        .string()
        .describe(
          "File path relative to docs dir, e.g. 'features/new-feature.mdx'"
        ),
      content: z
        .string()
        .describe("Full page content including frontmatter"),
      commit_message: z
        .string()
        .optional()
        .describe("Git commit message (default: 'docs: update {path}')"),
    },
    async ({ path: pagePath, content, commit_message }) => {
      // Ensure .mdx extension if content has imports
      if (content.includes("import ") && !pagePath.endsWith(".mdx")) {
        pagePath = pagePath.replace(/\.md$/, ".mdx");
        if (!pagePath.endsWith(".mdx")) pagePath += ".mdx";
      }

      const msg = commit_message || `docs: update ${pagePath}`;
      const result = await writeFileToGithub(env, pagePath, content, msg);

      const titleMatch = content.match(/^title:\s*(.+)$/m);
      const title = titleMatch
        ? titleMatch[1].replace(/^["']|["']$/g, "")
        : pagePath;
      const slug = pagePath.replace(/\.(mdx?|md)$/, "");

      let text = result.created
        ? `Created new page: ${pagePath}`
        : `Updated page: ${pagePath}`;

      if (result.created) {
        text += `\n\nNew page created. Add to sidebar in astro.config.mjs if needed.`;
        text += `\nSlug: '${slug}'`;
        text += `\nTitle: '${title}'`;
        text += `\nUse update_sidebar_config to add it, or trigger_deploy to rebuild.`;
      }

      text += `\n\nCommitted to GitHub: "${msg}"`;
      text += `\nRun trigger_deploy to publish changes to docs.hypertask.ai`;

      return { content: [{ type: "text", text }] };
    }
  );

  // Tool: delete_page
  server.tool(
    "delete_page",
    "Delete a documentation page from the repository",
    {
      page: z.string().describe("Page slug or file path to delete"),
      commit_message: z.string().optional().describe("Git commit message"),
    },
    async ({ page, commit_message }) => {
      const resolved = await resolvePagePath(env, page);
      if (!resolved) {
        return {
          content: [
            { type: "text", text: `Error: Page '${page}' not found.` },
          ],
        };
      }

      const msg = commit_message || `docs: delete ${resolved}`;
      const deleted = await deleteFileFromGithub(env, resolved, msg);

      if (!deleted) {
        return {
          content: [
            {
              type: "text",
              text: `Error: Could not delete '${resolved}'.`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `Deleted ${resolved}. Remember to remove it from the sidebar config.\nRun trigger_deploy to publish changes.`,
          },
        ],
      };
    }
  );

  // Tool: read_sidebar_config
  server.tool(
    "read_sidebar_config",
    "Read the current astro.config.mjs to see the sidebar structure and site configuration",
    {},
    async () => {
      const file = await readRepoFile(env, env.CONFIG_FILE_PATH);
      if (!file) {
        return {
          content: [
            { type: "text", text: "Error: Could not read astro.config.mjs" },
          ],
        };
      }
      return { content: [{ type: "text", text: file.content }] };
    }
  );

  // Tool: update_sidebar_config
  server.tool(
    "update_sidebar_config",
    "Update the astro.config.mjs file. Provide the FULL file content. This controls sidebar navigation and site config.",
    {
      content: z.string().describe("Full content of astro.config.mjs"),
      commit_message: z.string().optional().describe("Git commit message"),
    },
    async ({ content, commit_message }) => {
      const msg = commit_message || "docs: update sidebar config";
      await writeRepoFile(env, env.CONFIG_FILE_PATH, content, msg);
      return {
        content: [
          {
            type: "text",
            text: `Updated astro.config.mjs. Committed: "${msg}"\nRun trigger_deploy to publish changes.`,
          },
        ],
      };
    }
  );

  // Tool: trigger_deploy
  server.tool(
    "trigger_deploy",
    "Trigger a Cloudflare Pages rebuild to publish the latest changes from GitHub to docs.hypertask.ai. If the deploy hook is not configured, returns manual deploy instructions.",
    {},
    async () => {
      if (!env.CF_PAGES_DEPLOY_HOOK) {
        return {
          content: [
            {
              type: "text",
              text: "CF_PAGES_DEPLOY_HOOK not configured. To deploy manually, someone with local access needs to run:\n\ncd /home/valentin/projects/HypertaskDocs && git pull && npm run build && CLOUDFLARE_ACCOUNT_ID=6031a7dff0d4a6469414cfa8a6dedddf npx wrangler pages deploy dist --project-name hypertask-docs",
            },
          ],
        };
      }

      const res = await fetch(env.CF_PAGES_DEPLOY_HOOK, { method: "POST" });
      if (!res.ok) {
        const err = await res.text();
        return {
          content: [
            {
              type: "text",
              text: `Deploy trigger failed (${res.status}): ${err}\n\nFallback: deploy manually via local machine.`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "Deploy triggered! Cloudflare Pages is rebuilding docs.hypertask.ai from the latest GitHub commit. This typically takes 1-2 minutes.",
          },
        ],
      };
    }
  );

  return server;
}

// --- CORS headers ---

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, mcp-session-id, Mcp-Protocol-Version",
};

// --- Worker entry point ---

export default {
  async fetch(
    request: Request,
    env: Env,
    _ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);

    // Health check
    if (
      (url.pathname === "/" || url.pathname === "/health") &&
      request.method === "GET"
    ) {
      return new Response(
        JSON.stringify({ status: "ok", service: "hypertask-docs-mcp" }),
        {
          headers: {
            "Content-Type": "application/json",
            ...CORS_HEADERS,
          },
        }
      );
    }

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    // OAuth Protected Resource metadata (RFC 9728)
    // MCP clients fetch this first from the resource server to discover the authorization server
    if (url.pathname === "/.well-known/oauth-protected-resource") {
      const resourceMetadata = {
        resource: url.origin,
        authorization_servers: ["https://app.hypertask.ai"],
        scopes_supported: ["mcp:full"],
        bearer_methods_supported: ["header"],
      };
      return new Response(JSON.stringify(resourceMetadata), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=3600",
          ...CORS_HEADERS,
        },
      });
    }

    // OAuth 2.1 metadata endpoint (RFC 8414)
    // Points to Hypertask's existing OAuth server so clients (claude.ai, Cursor, etc.)
    // can discover auth endpoints and do the OAuth dance with app.hypertask.ai
    if (url.pathname === "/.well-known/oauth-authorization-server") {
      const metadata = {
        issuer: "https://app.hypertask.ai",
        authorization_endpoint: "https://app.hypertask.ai/oauth/authorize",
        token_endpoint: "https://app.hypertask.ai/oauth/token",
        registration_endpoint: "https://app.hypertask.ai/oauth/register",
        response_types_supported: ["code"],
        grant_types_supported: ["authorization_code"],
        code_challenge_methods_supported: ["S256"],
        token_endpoint_auth_methods_supported: ["none"],
        scopes_supported: ["mcp:full"],
      };
      return new Response(JSON.stringify(metadata), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=3600",
          ...CORS_HEADERS,
        },
      });
    }

    // Only /mcp path handles MCP connections
    if (url.pathname !== "/mcp") {
      return new Response("Not found", { status: 404 });
    }

    // Validate JWT from Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({
          jsonrpc: "2.0",
          error: {
            code: -32001,
            message: "Unauthorized. Please authenticate via OAuth.",
          },
          id: null,
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            "WWW-Authenticate":
              `Bearer resource_metadata="${url.origin}/.well-known/oauth-protected-resource"`,
            ...CORS_HEADERS,
          },
        }
      );
    }

    const token = authHeader.slice(7);
    try {
      await validateJwt(token, env.JWT_SECRET);
    } catch {
      return new Response(
        JSON.stringify({
          jsonrpc: "2.0",
          error: {
            code: -32001,
            message: "Invalid or expired token. Please re-authenticate.",
          },
          id: null,
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            "WWW-Authenticate":
              'Bearer error="invalid_token"',
            ...CORS_HEADERS,
          },
        }
      );
    }

    // Create a stateless MCP transport per request
    const transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // stateless mode
    });

    // Create and connect the MCP server
    const server = createMcpServer(env);
    await server.connect(transport);

    // Handle the request
    const response = await transport.handleRequest(request);

    // Add CORS headers to the response
    const newHeaders = new Headers(response.headers);
    for (const [key, value] of Object.entries(CORS_HEADERS)) {
      newHeaders.set(key, value);
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  },
};
