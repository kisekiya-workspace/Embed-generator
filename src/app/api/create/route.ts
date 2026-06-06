import { corsHeaders, jsonWithCors } from "@/lib/cors";
import { createEmbed, parseCreateInput } from "@/lib/create-embed";

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
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

  return jsonWithCors(
    {
      id: result.id,
      url: result.url,
      preview: result.preview,
      imageUrl: result.preview,
      shareAsImage: true,
    },
    {
      headers: {
        "X-RateLimit-Remaining": result.remaining.toString(),
      },
    },
  );
}
