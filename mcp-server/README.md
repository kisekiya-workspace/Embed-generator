# Embed Generator MCP Server

MCP server that connects AI agents to the [Embed & Image Generator](https://embed-generator-woad.vercel.app) API.

## Tools

| Tool | Use when |
|---|---|
| `render_markdown_to_image` | One-off PNG for WhatsApp/iMessage (no storage) |
| `create_embed_link` | Persistent link + OG preview for Discord/Slack |
| `list_themes` | Discover `light`, `dark`, `chatgpt`, `ocean`, `sunset` |

## Install

```bash
cd mcp-server
npm install
npm run build
```

## Cursor / Claude Desktop config

Point at your deployment or local dev server:

```json
{
  "mcpServers": {
    "embed-generator": {
      "command": "node",
      "args": ["D:/Projects/embed-generator/mcp-server/dist/index.js"],
      "env": {
        "EMBED_GENERATOR_URL": "https://embed-generator-woad.vercel.app"
      }
    }
  }
}
```

For local dev:

```json
"EMBED_GENERATOR_URL": "http://localhost:3000"
```

## Self-hosted API

Set `EMBED_GENERATOR_URL` to your fork's domain. The MCP server only calls HTTP endpoints — no Redis credentials needed in the MCP process.

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) in the repo root.
