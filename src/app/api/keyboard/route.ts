import { binaryWithCors, corsHeaders, jsonWithCors, textWithCors } from "@/lib/cors";
import { createEmbed, parseCreateInput } from "@/lib/create-embed";
import { parseThemeId, themeCatalog } from "@/lib/og-themes";
import { renderOgImage } from "@/lib/render-og-image";
import type { EmbedTheme } from "@/lib/types";

type CreateSuccess = Extract<Awaited<ReturnType<typeof createEmbed>>, { ok: true }>;

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
  return jsonWithCors({
    endpoint: "/api/keyboard",
    methods: ["POST", "OPTIONS"],
    description:
      "Turn markdown into a shareable chat artifact. Prefer format=image for WhatsApp-quality display.",
    modes: {
      image: {
        query: "format=image",
        response: "image/png bytes — paste as photo in chat (best visual quality)",
        headers: { "X-Embed-Url": "optional link to include below the image" },
      },
      json: {
        query: "format=json (default)",
        response: "{ url, id, preview, imageUrl }",
      },
      text: {
        query: "format=text",
        response: "plain text URL only",
      },
    },
    request: {
      json: {
        contentType: "application/json",
        body: {
          content: "required",
          title: "optional",
          theme: `optional — one of: ${themeCatalog.map((t) => t.id).join(", ")}`,
        },
      },
      plain: {
        contentType: "text/plain",
        body: "raw markdown",
      },
    },
    keyboardFlow: [
      "1. User gets markdown from AI",
      "2. POST /api/keyboard?format=image with markdown body",
      "3. Insert returned PNG into chat as image attachment",
      "4. Optionally append X-Embed-Url header value as a link",
    ],
  });
}

function getResponseFormat(request: Request): string {
  return new URL(request.url).searchParams.get("format") ?? "json";
}

async function imageResponse(
  request: Request,
  result: CreateSuccess,
  input: { title: string; content: string; theme: EmbedTheme },
) {
  const pngResponse = await renderOgImage({
    title: input.title,
    content: input.content,
    theme: input.theme,
  });
  const bytes = await pngResponse.arrayBuffer();

  return binaryWithCors(bytes, "image/png", {
    headers: {
      "X-RateLimit-Remaining": result.remaining.toString(),
      "X-Embed-Id": result.id,
      "X-Embed-Url": result.url,
      "Content-Disposition": `inline; filename="embed-${result.id}.png"`,
    },
  });
}

function successResponse(
  request: Request,
  result: CreateSuccess,
  input: { title: string; content: string; theme: EmbedTheme },
) {
  const format = getResponseFormat(request);

  if (format === "image" || format === "png") {
    return imageResponse(request, result, input);
  }

  if (format === "text" || format === "url" || format === "plain") {
    return textWithCors(result.url, {
      headers: {
        "X-RateLimit-Remaining": result.remaining.toString(),
        "X-Embed-Id": result.id,
        "X-Embed-Preview": result.preview,
      },
    });
  }

  return jsonWithCors(
    {
      url: result.url,
      id: result.id,
      preview: result.preview,
      imageUrl: result.preview,
      recommendedFor: {
        whatsapp: "format=image — send PNG as photo attachment",
        telegram: "format=image or format=text",
        discord: "paste markdown directly, or format=image",
        imessage: "format=image — send as image attachment",
      },
    },
    {
      headers: {
        "X-RateLimit-Remaining": result.remaining.toString(),
      },
    },
  );
}

export async function POST(request: Request) {
  const parsed = await parseCreateInput(request);

  if ("error" in parsed) {
    return jsonWithCors({ error: parsed.error }, { status: 400 });
  }

  const theme = parseThemeId(parsed.theme);
  const title = (parsed.title ?? "").trim();
  const result = await createEmbed(request, {
    content: parsed.content,
    title,
    theme,
  });

  if (!result.ok) {
    return jsonWithCors(
      { error: result.error },
      {
        status: result.status,
        headers: result.remaining !== undefined
          ? { "X-RateLimit-Remaining": result.remaining.toString() }
          : undefined,
      },
    );
  }

  return successResponse(request, result, {
    title,
    content: parsed.content,
    theme,
  });
}
