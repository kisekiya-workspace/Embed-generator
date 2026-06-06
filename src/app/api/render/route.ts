import { binaryWithCors, corsHeaders, jsonWithCors } from "@/lib/cors";
import {
  MAX_CONTENT_LENGTH,
  MAX_TITLE_LENGTH,
} from "@/lib/constants";
import { parseCreateInput } from "@/lib/create-embed";
import { checkCreateRateLimit, getClientIp } from "@/lib/rate-limit";
import { parseThemeId } from "@/lib/og-themes";
import { renderOgImage } from "@/lib/render-og-image";

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

function getFormat(request: Request): string {
  return new URL(request.url).searchParams.get("format") ?? "image";
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = await checkCreateRateLimit(ip);

  if (!rateLimit.allowed) {
    return jsonWithCors(
      { error: "Rate limit exceeded. Try again in an hour." },
      { status: 429 },
    );
  }

  const parsed = await parseCreateInput(request);

  if ("error" in parsed) {
    return jsonWithCors({ error: parsed.error }, { status: 400 });
  }

  const content = parsed.content.trim();
  if (!content) {
    return jsonWithCors({ error: "Content is required." }, { status: 400 });
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    return jsonWithCors(
      { error: `Content must be ${MAX_CONTENT_LENGTH} characters or fewer.` },
      { status: 400 },
    );
  }

  const title = (parsed.title ?? "").trim();
  if (title.length > MAX_TITLE_LENGTH) {
    return jsonWithCors(
      { error: `Title must be ${MAX_TITLE_LENGTH} characters or fewer.` },
      { status: 400 },
    );
  }

  const theme = parseThemeId(parsed.theme);
  const format = getFormat(request);

  try {
    const pngResponse = await renderOgImage({ title, content, theme });
    const bytes = await pngResponse.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (format === "base64" || format === "json") {
      return jsonWithCors(
        {
          mimeType: "image/png",
          width: 1200,
          height: 630,
          base64: buffer.toString("base64"),
          title: title || undefined,
          stored: false,
        },
        {
          headers: {
            "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          },
        },
      );
    }

    return binaryWithCors(bytes, "image/png", {
      headers: {
        "X-RateLimit-Remaining": rateLimit.remaining.toString(),
        "Content-Disposition": 'inline; filename="render.png"',
      },
    });
  } catch (error) {
    console.error("Render failed:", error);
    return jsonWithCors(
      { error: "Failed to render image." },
      { status: 500 },
    );
  }
}
