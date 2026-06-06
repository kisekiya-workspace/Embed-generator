import { jsonWithCors, corsHeaders } from "@/lib/cors";
import { themeCatalog } from "@/lib/og-themes";

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
  return jsonWithCors({
    themes: themeCatalog,
    usage: {
      json: '{ "content": "...", "theme": "chatgpt" }',
      query: "?theme=ocean on text/plain requests",
    },
  });
}
