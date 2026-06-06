export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function withCorsHeaders(init?: ResponseInit): Headers {
  const headers = new Headers(init?.headers);
  for (const [key, value] of Object.entries(corsHeaders)) {
    headers.set(key, value);
  }
  return headers;
}

export function jsonWithCors(body: unknown, init?: ResponseInit): Response {
  return Response.json(body, {
    ...init,
    headers: withCorsHeaders(init),
  });
}

export function textWithCors(body: string, init?: ResponseInit): Response {
  const headers = withCorsHeaders(init);
  headers.set("Content-Type", "text/plain; charset=utf-8");
  return new Response(body, {
    ...init,
    headers,
  });
}
