#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const DEFAULT_API_URL = "https://embed-generator-woad.vercel.app";

const THEMES = ["light", "dark", "chatgpt", "ocean", "sunset"] as const;

type Theme = (typeof THEMES)[number];

function getApiUrl(): string {
  return (process.env.EMBED_GENERATOR_URL ?? DEFAULT_API_URL).replace(/\/$/, "");
}

function parseTheme(value: unknown): Theme {
  if (typeof value === "string" && THEMES.includes(value as Theme)) {
    return value as Theme;
  }

  return "dark";
}

async function postJson<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${getApiUrl()}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? `API error ${response.status}`);
  }

  return data;
}

const server = new Server(
  {
    name: "embed-generator",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "render_markdown_to_image",
      description:
        "Render markdown to a PNG image without storing. Best for one-off chat shares (WhatsApp, iMessage). Returns base64 PNG.",
      inputSchema: {
        type: "object",
        properties: {
          content: {
            type: "string",
            description: "Markdown body (GFM tables supported)",
          },
          title: {
            type: "string",
            description: "Optional title shown on the image",
          },
          theme: {
            type: "string",
            enum: THEMES,
            description: "Visual theme (default: dark)",
          },
        },
        required: ["content"],
      },
    },
    {
      name: "create_embed_link",
      description:
        "Store markdown and return a shareable URL with OG preview. Best for Discord, Slack, and persistent links.",
      inputSchema: {
        type: "object",
        properties: {
          content: {
            type: "string",
            description: "Markdown body",
          },
          title: {
            type: "string",
            description: "Optional title",
          },
          theme: {
            type: "string",
            enum: THEMES,
            description: "Visual theme (default: dark)",
          },
        },
        required: ["content"],
      },
    },
    {
      name: "list_themes",
      description: "List available image themes for renders and embeds.",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const input = (args ?? {}) as Record<string, unknown>;

  try {
    if (name === "list_themes") {
      const response = await fetch(`${getApiUrl()}/api/themes`);
      const data = (await response.json()) as { themes: unknown[] };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data.themes, null, 2),
          },
        ],
      };
    }

    const content = typeof input.content === "string" ? input.content.trim() : "";

    if (!content) {
      return {
        content: [{ type: "text", text: "Error: content is required." }],
        isError: true,
      };
    }

    const title = typeof input.title === "string" ? input.title : undefined;
    const theme = parseTheme(input.theme);

    if (name === "render_markdown_to_image") {
      const data = await postJson<{
        base64: string;
        mimeType: string;
        width: number;
        height: number;
      }>("/api/render?format=base64", { content, title, theme });

      return {
        content: [
          {
            type: "text",
            text: `Rendered ${data.width}x${data.height} PNG (${theme} theme). Send as a photo attachment in chat apps for full-width display.`,
          },
          {
            type: "image",
            data: data.base64,
            mimeType: data.mimeType,
          },
        ],
      };
    }

    if (name === "create_embed_link") {
      const data = await postJson<{
        id: string;
        url: string;
        preview?: string;
        imageUrl?: string;
      }>("/api/create", { content, title, theme });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                id: data.id,
                url: data.url,
                imageUrl: data.imageUrl ?? data.preview,
                hint: "Share url for link previews; download imageUrl for chat photo attachments.",
              },
              null,
              2,
            ),
          },
        ],
      };
    }

    return {
      content: [{ type: "text", text: `Unknown tool: ${name}` }],
      isError: true,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed";

    return {
      content: [{ type: "text", text: `Error: ${message}` }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("MCP server failed:", error);
  process.exit(1);
});
