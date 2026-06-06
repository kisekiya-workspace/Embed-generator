import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";

const examples = [
  {
    title: "Render image (no storage) — agents & scripts",
    code: `curl -X POST "https://your-domain.com/api/render?format=image" \\
  -H "Content-Type: text/plain" \\
  --data-binary "| Name | Score |
| ---- | ----- |
| Aria | 87    |" \\
  -o output.png`,
  },
  {
    title: "Base64 for AI agents",
    code: `curl -X POST "https://your-domain.com/api/render?format=base64" \\
  -H "Content-Type: application/json" \\
  -d '{"content":"| A | B |\\n| - | - |\\n| 1 | 2 |","title":"Scores"}'`,
  },
  {
    title: "Stored embed link — Discord / Slack previews",
    code: `curl -X POST "https://your-domain.com/api/create" \\
  -H "Content-Type: application/json" \\
  -d '{"content":"## Hello\\n\\nSome **markdown**","title":"Update"}'`,
  },
  {
    title: "Keyboard skill — PNG for WhatsApp",
    code: `POST /api/keyboard?format=image
Content-Type: text/plain

<markdown body>
→ image/png`,
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-full bg-zinc-50 dark:bg-zinc-950">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
        <div className="space-y-4">
          <Link
            href="/"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            ← Back to generator
          </Link>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
            API documentation
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Open-source API for markdown → image PNG and link embeds. Use
            stateless <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">/api/render</code> when you
            do not need a stored link.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Endpoints
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-zinc-100 dark:bg-zinc-900">
                <tr>
                  <th className="px-4 py-3 font-semibold">Endpoint</th>
                  <th className="px-4 py-3 font-semibold">Storage</th>
                  <th className="px-4 py-3 font-semibold">Best for</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-zinc-200 dark:border-zinc-800">
                  <td className="px-4 py-3 font-mono">POST /api/render</td>
                  <td className="px-4 py-3">No</td>
                  <td className="px-4 py-3">Agents, scripts, one-off images</td>
                </tr>
                <tr className="border-t border-zinc-200 dark:border-zinc-800">
                  <td className="px-4 py-3 font-mono">POST /api/keyboard</td>
                  <td className="px-4 py-3">Yes (90 days)</td>
                  <td className="px-4 py-3">Keyboards, automations</td>
                </tr>
                <tr className="border-t border-zinc-200 dark:border-zinc-800">
                  <td className="px-4 py-3 font-mono">POST /api/create</td>
                  <td className="px-4 py-3">Yes (90 days)</td>
                  <td className="px-4 py-3">Simple link creation</td>
                </tr>
                <tr className="border-t border-zinc-200 dark:border-zinc-800">
                  <td className="px-4 py-3 font-mono">GET /api/og/{"{id}"}</td>
                  <td className="px-4 py-3">—</td>
                  <td className="px-4 py-3">PNG for stored embeds</td>
                </tr>
                <tr className="border-t border-zinc-200 dark:border-zinc-800">
                  <td className="px-4 py-3 font-mono">GET /api</td>
                  <td className="px-4 py-3">—</td>
                  <td className="px-4 py-3">Machine-readable API discovery</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Examples
          </h2>
          {examples.map((example) => (
            <div
              key={example.title}
              className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
                {example.title}
              </h3>
              <pre className="mt-3 overflow-x-auto rounded-xl bg-zinc-950 p-4 text-xs leading-6 text-zinc-100">
                {example.code}
              </pre>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Themes
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Pass <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">theme</code> in
            JSON or as a query param on plain-text requests. List themes:{" "}
            <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">GET /api/themes</code>
          </p>
          <pre className="overflow-x-auto rounded-xl bg-zinc-950 p-4 text-xs leading-6 text-zinc-100">
            {`curl "https://your-domain.com/api/themes"

# Example render with ChatGPT-style theme
curl -X POST "https://your-domain.com/api/render?format=image" \\
  -H "Content-Type: application/json" \\
  -d '{"content":"| A | B |\\n| - | - |\\n| 1 | 2 |","theme":"chatgpt"}' \\
  -o table.png`}
          </pre>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            MCP server (Cursor, Claude Desktop)
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Agents can call the API via the bundled MCP server in{" "}
            <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">mcp-server/</code>.
            Tools: <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">render_markdown_to_image</code>,{" "}
            <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">create_embed_link</code>,{" "}
            <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">list_themes</code>.
          </p>
          <pre className="overflow-x-auto rounded-xl bg-zinc-950 p-4 text-xs leading-6 text-zinc-100">
            {`cd mcp-server && npm install && npm run build

# Cursor mcp.json
{
  "mcpServers": {
    "embed-generator": {
      "command": "node",
      "args": ["/path/to/embed-generator/mcp-server/dist/index.js"],
      "env": {
        "EMBED_GENERATOR_URL": "https://your-domain.com"
      }
    }
  }
}`}
          </pre>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            See <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">mcp-server/README.md</code> for
            full setup.
          </p>
        </section>

        <section
          id="contributing"
          className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Contributing
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Themes, docs, keyboard examples, and MCP improvements are especially
            welcome. See{" "}
            <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">CONTRIBUTING.md</code>{" "}
            in the repo root.
          </p>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Self-hosting
          </h2>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-zinc-950 p-4 text-xs leading-6 text-zinc-100">
            {`git clone <your-repo>
cd embed-generator
cp .env.example .env.local
# Add UPSTASH_REDIS_REST_URL + TOKEN for production
npm install && npm run dev`}
          </pre>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            Dev works without Redis (in-memory). Set{" "}
            <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">NEXT_PUBLIC_BASE_URL</code>{" "}
            to your domain in production.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
