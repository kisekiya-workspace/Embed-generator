<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Embed Generator — Agent Guide

Read this file first. Do not explore the repo blindly.

## What this is

Turns markdown into short shareable links with chat embed previews (WhatsApp, iMessage, Telegram, Discord). Chat apps show title + description + image only; formatting lives in a generated OG PNG.

## Commands

```bash
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

## Environment

Copy `.env.example` to `.env.local` at **project root** (not `src/`).

| Variable | Required | Purpose |
|---|---|---|
| `UPSTASH_REDIS_REST_URL` | prod | Short-link storage |
| `UPSTASH_REDIS_REST_TOKEN` | prod | Short-link storage |
| `NEXT_PUBLIC_BASE_URL` | prod | Absolute URLs in OG metadata |

Dev works without Redis (in-memory fallback). Production needs Upstash.

**Never read or commit `.env`, `.env.local`, or secret files.**

## Workspace structure

```
embed-generator/
├── AGENTS.md                 # agent entry point (this file)
├── CLAUDE.md                 # @AGENTS.md pointer
├── .env.example              # safe template
├── .env.local                # secrets — DO NOT READ
├── src/
│   ├── app/
│   │   ├── page.tsx          # create UI
│   │   ├── layout.tsx
│   │   ├── e/[id]/page.tsx   # embed page + generateMetadata
│   │   └── api/
│   │       ├── create/route.ts
│   │       └── og/[id]/route.tsx   # edge OG PNG
│   ├── components/
│   │   ├── create-form.tsx
│   │   └── markdown-content.tsx
│   └── lib/
│       ├── store.ts          # Redis + dev memory fallback
│       ├── markdown.ts       # marked → MarkdownBlock[]
│       ├── og-template.tsx   # OG card layout
│       ├── rate-limit.ts
│       ├── constants.ts
│       ├── types.ts
│       └── base-url.ts
└── .cursor/                  # ignore unless user asks
```

## Request flow

```
markdown → POST /api/create → Redis embed:{id}
share /e/{id} → crawler reads OG tags → /api/og/{id} PNG
```

## Conventions

- App Router: server components for `/e/[id]`, client only for create form
- Edge runtime on `/api/og/[id]`
- Markdown → `MarkdownBlock[]` shared by web page and OG image
- GFM tables render as aligned tables (web + OG image)
- Minimal diffs; match existing code style
- No new markdown docs unless user asks

## Limits (`src/lib/constants.ts`)

| Constant | Value |
|---|---|
| Max content | 4096 chars |
| Max title | 120 chars |
| Link TTL | 90 days |
| Rate limit | 30 creates/hour/IP |
| OG size | 1200×630 |

## Where to change things

| Task | File(s) |
|---|---|
| Create UI | `src/components/create-form.tsx`, `src/app/page.tsx` |
| OG design | `src/lib/og-template.tsx` |
| Markdown | `src/lib/markdown.ts` |
| Storage | `src/lib/store.ts` |
| OG meta | `src/app/e/[id]/page.tsx` |
| API | `src/app/api/create/route.ts` |

## Out of scope

- `.env*` (secrets)
- `.cursor/`, `*.mdc`, `SKILL.md`
- `.next/`, `node_modules/`

## Deploy

Vercel + Upstash. Set `NEXT_PUBLIC_BASE_URL` to production domain.


## Keyboard app API`n`nUse ``POST /api/keyboard`` (preferred) or ``POST /api/create``.``n`n- **JSON**: ``{ content, title?, theme? }`` → ``{ url, id, preview }```n- **Plain text link**: ``POST /api/keyboard?format=text`` with ``Content-Type: text/plain`` body = markdown → response body is only the URL`n- **Docs**: ``GET /api/keyboard```n- CORS enabled for cross-origin keyboard clients.
