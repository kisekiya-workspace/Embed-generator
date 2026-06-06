# Contributing

Thanks for helping make markdown shareable in chat apps. This project is MIT-licensed and welcomes issues, docs fixes, themes, and integrations.

## Quick start

```bash
git clone <your-fork-url>
cd embed-generator
cp .env.example .env.local
npm install
npm run dev
```

Dev runs without Redis (in-memory storage). For persistent links, add free [Upstash Redis](https://upstash.com) credentials.

## Ways to contribute

### Report bugs

Open an issue with:

- Markdown input that failed (or a minimal repro)
- Expected vs actual behavior
- Chat app or agent context (WhatsApp, Cursor MCP, keyboard skill, etc.)

### Add a theme

Themes live in `src/lib/og-themes.ts`:

1. Add an id to `THEME_IDS`
2. Add a palette to `ogThemes` (all color fields required — Satori breaks on `undefined`)
3. Add a short `description` in `themeCatalog`
4. Test via the web UI theme picker and `POST /api/render?format=image`

### Extend the API

- Discovery JSON: `src/lib/api-docs.ts`
- Human docs: `src/app/docs/page.tsx`
- Keep CORS helpers in `src/lib/cors.ts`

### MCP server

`mcp-server/` is a standalone package. After API changes:

```bash
cd mcp-server && npm run build
```

Add tools in `mcp-server/src/index.ts` and document them in `mcp-server/README.md`.

### Docs & examples

Real-world curl examples and keyboard flows help newcomers most. PRs that add use-case snippets to `/docs` or `README.md` are welcome.

## Pull request checklist

- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] Theme/API changes reflected in `GET /api` and `/docs`
- [ ] No secrets in commits (`.env.local` stays local)

## Code style

- Match existing patterns in nearby files
- Minimal diffs — one concern per PR when possible
- Satori/OG rules: no `undefined` styles, no `null` JSX children, use `safeText()` for user strings

## Questions

Open a GitHub Discussion or issue. For agent-specific setup, see `AGENTS.md` and `mcp-server/README.md`.
