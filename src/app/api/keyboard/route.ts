import { jsonWithCors, corsHeaders, textWithCors } from "@/lib/cors";
import { createEmbed, parseCreateInput } from "@/lib/create-embed";

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
  return jsonWithCors({
    endpoint: "/api/keyboard",
    methods: ["POST", "OPTIONS"],
    description: "Create a shareable embed link from markdown (keyboard apps).",
    request: {
      json: {
        contentType: "application/json",
        body: {
          content: "required markdown string",
          title: "optional string",
          theme: "optional light | dark",
        },
      },
      plain: {
        contentType: "text/plain",
        body: "raw markdown string",
        query: {
          title: "optional",
          theme: "optional light | dark",
          format: "text | json (default json)",
        },
      },
      form: {
        contentType: "application/x-www-form-urlencoded",
        fields: ["content", "title?", "theme?", "format?"],
      },
    },
    response: {
      json: {
        url: "share this link in chat",
        id: "embed id",
        preview: "og image url",
      },
      text: "plain body containing only url when format=text",
    },
    example: {
      curl_json: `curl -X POST https://yoursite.com/api/keyboard -H "Content-Type: application/json" -d "{\\"content\\":\\"| A | B |\\\\n| - | - |\\\\n| 1 | 2 |\\"}"`,
      curl_text: `curl -X POST "https://yoursite.com/api/keyboard?format=text" -H "Content-Type: text/plain" --data-binary "@result.md"`,
    },
  });
}

function wantsTextResponse(request: Request): boolean {
  const params = new URL(request.url).searchParams;
  const format = params.get("format");
  if (format === "text" || format === "url" || format === "plain") {
    return true;
  }

  const accept = request.headers.get("accept") ?? "";
  return accept.includes("text/plain") && !accept.includes("application/json");
}

function successResponse(request: Request, result: Extract<Awaited<ReturnType<typeof createEmbed>>, { ok: true }>) {
  if (wantsTextResponse(request)) {
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

  const result = await createEmbed(request, parsed);

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

  return successResponse(request, result);
}
