export const API_VERSION = "1.0.0";

export const apiOverview = {
  name: "Embed & Image Generator API",
  version: API_VERSION,
  description:
    "Open-source API to turn markdown into shareable link embeds and chat-ready PNG images.",
  baseUrl: "Set NEXT_PUBLIC_BASE_URL or use your deployment domain",
  formats: {
    json: "Structured response with url, id, preview, imageUrl",
    text: "Plain text URL only (?format=text)",
    image: "Raw PNG bytes (?format=image) — best for WhatsApp/Telegram photos",
    base64: "JSON with base64 PNG (?format=base64) — best for agents/tools",
  },
  endpoints: [
    {
      path: "/api",
      method: "GET",
      description: "API discovery (this document)",
    },
    {
      path: "/api/themes",
      method: "GET",
      description: "List community image themes (light, dark, chatgpt, ocean, sunset)",
      storage: false,
    },
    {
      path: "/api/render",
      method: "POST",
      description: "Stateless — render markdown to image without storing (agents, scripts)",
      formats: ["image", "base64", "json"],
      storage: false,
    },
    {
      path: "/api/keyboard",
      method: "POST",
      description: "Create stored embed + return link and/or image (keyboard apps, automations)",
      formats: ["json", "text", "image"],
      storage: true,
    },
    {
      path: "/api/create",
      method: "POST",
      description: "Create stored embed, return link (simple JSON)",
      formats: ["json"],
      storage: true,
    },
    {
      path: "/api/og/{id}",
      method: "GET",
      description: "Get PNG preview for a stored embed",
      storage: false,
    },
    {
      path: "/e/{id}",
      method: "GET",
      description: "Public embed page with Open Graph metadata",
      storage: false,
    },
  ],
  useCases: [
    {
      id: "whatsapp-image",
      title: "WhatsApp / iMessage",
      recommendation: "POST /api/render?format=image or share PNG from /api/keyboard?format=image",
    },
    {
      id: "agents",
      title: "AI agents & tools",
      recommendation: "POST /api/render?format=base64 — no storage, inline PNG in JSON",
    },
    {
      id: "link-preview",
      title: "Link previews (Discord, Slack, Twitter)",
      recommendation: "POST /api/create — share /e/{id} URL",
    },
    {
      id: "keyboard",
      title: "Custom keyboard skills",
      recommendation: "POST /api/keyboard with format=text or format=image",
    },
    {
      id: "self-host",
      title: "Self-hosted / fork",
      recommendation: "Deploy to Vercel + Upstash Redis, or dev mode without Redis",
    },
    {
      id: "mcp",
      title: "Cursor / Claude MCP",
      recommendation:
        "Use mcp-server/ — tools: render_markdown_to_image, create_embed_link, list_themes",
    },
  ],
  themes: ["light", "dark", "chatgpt", "ocean", "sunset"],
  mcp: {
    package: "mcp-server/",
    tools: ["render_markdown_to_image", "create_embed_link", "list_themes"],
    env: { EMBED_GENERATOR_URL: "API base URL (default: production deployment)" },
  },
} as const;
