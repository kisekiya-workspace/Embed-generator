import { jsonWithCors, corsHeaders } from "@/lib/cors";
import { apiOverview } from "@/lib/api-docs";
import { getBaseUrl } from "@/lib/base-url";

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
  return jsonWithCors({
    ...apiOverview,
    baseUrl: getBaseUrl(),
    openSource: true,
    license: "MIT",
  });
}
