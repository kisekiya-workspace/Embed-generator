# Embed & Image Generator

Open-source tool and API that turns **markdown into chat-ready PNG images** and **shareable embed links**.

Chat apps (WhatsApp, iMessage) cannot render markdown. This project fixes that by generating formatted images you send as photos, plus optional short links with Open Graph previews for Discord, Slack, and the web.

## Features

- **Image mode** — PNG with tables, lists, headings (full-width in chat)
- **Embed mode** — short links with OG preview cards (`/e/{id}`)
- **Stateless API** — `/api/render` for agents (no database)
- **Stored API** — `/api/create`, `/api/keyboard` with 90-day TTL
- **Community themes** — light, dark, chatgpt, ocean, sunset
- **MCP server** — Cursor / Claude agents can render images via `mcp-server/`
- **Self-hostable** — Vercel + Upstash Redis, or local dev without Redis

## Use cases

| Use case | Endpoint | Output |
|---|---|---|
| WhatsApp / iMessage photo | `POST /api/render?format=image` | PNG bytes |
| AI agents & tools | `POST /api/render?format=base64` | JSON + base64 PNG |
| Discord / Slack link preview | `POST /api/create` | `{ url }` |
| Keyboard / automation skills | `POST /api/keyboard?format=image` | PNG or URL |
| Web UI | `/` | Generate, share, download |

## Quick start

```bash
git clone <your-repo-url>
cd embed-generator
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_BASE_URL` | Production | Public URL for links and OG tags |
| `NEXT_PUBLIC_GITHUB_URL` | Optional | Footer GitHub link (omit placeholder until published) |
| `UPSTASH_REDIS_REST_URL` | Production | Short-link storage |
| `UPSTASH_REDIS_REST_TOKEN` | Production | Short-link storage |

Dev works without Redis (in-memory, non-persistent).

## API

Discovery: `GET /api` — machine-readable docs JSON.

Human docs: [/docs](https://your-domain.com/docs) when deployed.

### Render image (no storage)

```bash
curl -X POST "http://localhost:3000/api/render?format=image" \
  -H "Content-Type: text/plain" \
  --data-binary "| Name | Score |
| ---- | ----- |
| Aria | 87 |" \
  -o scores.png
```

### Base64 for agents

```bash
curl -X POST "http://localhost:3000/api/render?format=base64" \
  -H "Content-Type: application/json" \
  -d '{"content":"| A | B |\n| - | - |\n| 1 | 2 |","title":"Result"}'
```

### Create embed link

```bash
curl -X POST "http://localhost:3000/api/create" \
  -H "Content-Type: application/json" \
  -d '{"content":"## Hello\n\n**World**","title":"Greeting"}'
```

## MCP server (agents)

```bash
cd mcp-server && npm install && npm run build
```

Configure in Cursor with `EMBED_GENERATOR_URL` pointing at your deployment. Tools:

- `render_markdown_to_image` — stateless PNG (WhatsApp photo)
- `create_embed_link` — stored URL with OG preview
- `list_themes` — available themes

See [mcp-server/README.md](./mcp-server/README.md).

## Deploy

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add Upstash Redis integration
4. Set `NEXT_PUBLIC_BASE_URL` to your domain

## Project structure

```
src/app/          Routes (UI, API, embed pages)
src/components/   React UI
src/lib/          Core logic (markdown, OG render, storage)
AGENTS.md         Guide for AI coding agents
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Themes, MCP tools, keyboard examples, and docs are great first PRs.

## License

MIT — see [LICENSE](./LICENSE).
