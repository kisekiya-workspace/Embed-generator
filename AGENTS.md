<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Embed & Image Generator — Agent Guide

Read this file first. Open-source tool: markdown → PNG images + embed links.

## What this is

- **Image API** — formatted PNG for WhatsApp, agents, keyboards (`/api/render`, `/api/keyboard?format=image`)
- **Embed API** — short links with OG previews (`/api/create`, `/e/[id]`)
- **Web UI** — generate, share image, optional link

## Commands

npm run dev | build | lint

## API endpoints

| Endpoint | Storage | Use |
|---|---|---|
| POST /api/render | No | Agents, scripts, one-off PNG (?format=image or base64) |
| POST /api/keyboard | Yes | Keyboards, automations (image/text/json) |
| POST /api/create | Yes | Simple embed link |
| GET /api/og/[id] | — | PNG for stored embed |
| GET /api | — | API discovery JSON |
| GET /api/themes | — | Theme catalog |
| GET /docs | — | Human API docs page |

## MCP server

mcp-server/ — stdio MCP with render_markdown_to_image, create_embed_link, list_themes.
Env: EMBED_GENERATOR_URL (default production deployment).

## Environment

.env.local at project root. See .env.example. Never read secret files.

## Workspace structure

src/app/api/render/route.ts   # stateless image
src/app/api/keyboard/route.ts # stored + formats
src/app/api/create/route.ts
src/app/api/og/[id]/route.tsx
src/app/e/[id]/page.tsx
src/lib/render-og-image.tsx
src/lib/og-template.tsx
src/lib/markdown.ts
src/lib/store.ts
src/lib/api-docs.ts
src/lib/og-themes.ts
mcp-server/src/index.ts

## Conventions

- Tables: full-bleed OG image, no og:description for table embeds
- Satori: never undefined style values or null JSX children
- Minimal diffs; MIT open source

## Deploy

Vercel + Upstash. NEXT_PUBLIC_BASE_URL required in prod.
