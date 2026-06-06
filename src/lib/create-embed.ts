import { nanoid } from "nanoid";
import { getBaseUrl } from "@/lib/base-url";
import {
  EMBED_ID_LENGTH,
  MAX_CONTENT_LENGTH,
  MAX_TITLE_LENGTH,
} from "@/lib/constants";
import { checkCreateRateLimit, getClientIp } from "@/lib/rate-limit";
import { isStorageConfigured, saveEmbed } from "@/lib/store";
import { parseThemeId } from "@/lib/og-themes";
import type { EmbedTheme } from "@/lib/types";

export type CreateEmbedInput = {
  content: string;
  title?: string;
  theme?: EmbedTheme;
};

export type CreateEmbedSuccess = {
  ok: true;
  id: string;
  url: string;
  preview: string;
  remaining: number;
};

export type CreateEmbedFailure = {
  ok: false;
  status: number;
  error: string;
  remaining?: number;
};

export type CreateEmbedOutcome = CreateEmbedSuccess | CreateEmbedFailure;

function parseTheme(value: string | null | undefined): EmbedTheme {
  return parseThemeId(value ?? undefined);
}

export async function parseCreateInput(
  request: Request,
): Promise<CreateEmbedInput | { error: string }> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      const body = (await request.json()) as CreateEmbedInput;
      return {
        content: body.content ?? "",
        title: body.title,
        theme: body.theme,
      };
    } catch {
      return { error: "Invalid JSON body." };
    }
  }

  if (contentType.includes("text/plain")) {
    const content = await request.text();
    const params = new URL(request.url).searchParams;
    return {
      content,
      title: params.get("title") ?? undefined,
      theme: parseTheme(params.get("theme")),
    };
  }

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const form = await request.formData();
    return {
      content: form.get("content")?.toString() ?? "",
      title: form.get("title")?.toString(),
      theme: parseTheme(form.get("theme")?.toString()),
    };
  }

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    return {
      content: form.get("content")?.toString() ?? "",
      title: form.get("title")?.toString(),
      theme: parseTheme(form.get("theme")?.toString()),
    };
  }

  return { error: "Unsupported Content-Type. Use application/json or text/plain." };
}

export async function createEmbed(
  request: Request,
  input: CreateEmbedInput,
): Promise<CreateEmbedOutcome> {
  if (!isStorageConfigured()) {
    return {
      ok: false,
      status: 503,
      error:
        "Storage is not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.",
    };
  }

  const ip = getClientIp(request);
  const rateLimit = await checkCreateRateLimit(ip);

  if (!rateLimit.allowed) {
    return {
      ok: false,
      status: 429,
      error: "Rate limit exceeded. Try again in an hour.",
      remaining: rateLimit.remaining,
    };
  }

  const content = input.content.trim();
  if (!content) {
    return { ok: false, status: 400, error: "Content is required." };
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    return {
      ok: false,
      status: 400,
      error: `Content must be ${MAX_CONTENT_LENGTH} characters or fewer.`,
    };
  }

  const title = (input.title ?? "").trim();
  if (title.length > MAX_TITLE_LENGTH) {
    return {
      ok: false,
      status: 400,
      error: `Title must be ${MAX_TITLE_LENGTH} characters or fewer.`,
    };
  }

  const theme = parseThemeId(input.theme);
  const id = nanoid(EMBED_ID_LENGTH);
  const baseUrl = getBaseUrl();

  await saveEmbed(id, {
    title,
    content,
    theme,
    createdAt: Date.now(),
  });

  return {
    ok: true,
    id,
    url: `${baseUrl}/e/${id}`,
    preview: `${baseUrl}/api/og/${id}`,
    remaining: rateLimit.remaining,
  };
}
