import { ImageResponse } from "next/og";
import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from "@/lib/constants";
import { parseMarkdown } from "@/lib/markdown";
import { OgCard } from "@/lib/og-template";
import { parseThemeId } from "@/lib/og-themes";
import type { EmbedTheme } from "@/lib/types";

async function loadInterFont(weight: 400 | 700): Promise<ArrayBuffer> {
  const file =
    weight === 700
      ? "inter-latin-700-normal.woff"
      : "inter-latin-400-normal.woff";
  const response = await fetch(
    `https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.8/files/${file}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to load Inter ${weight} font.`);
  }

  return response.arrayBuffer();
}

export async function renderOgImage(input: {
  title: string;
  content: string;
  theme: EmbedTheme;
  cacheControl?: string;
}): Promise<Response> {
  const [interRegular, interBold] = await Promise.all([
    loadInterFont(400),
    loadInterFont(700),
  ]);
  const blocks = parseMarkdown(input.content);
  const theme = parseThemeId(input.theme);

  return new ImageResponse(
    (
      <OgCard title={input.title} blocks={blocks} theme={theme} />
    ),
    {
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
      fonts: [
        {
          name: "Inter",
          data: interRegular,
          style: "normal",
          weight: 400,
        },
        {
          name: "Inter",
          data: interBold,
          style: "normal",
          weight: 700,
        },
      ],
      headers: input.cacheControl
        ? { "Cache-Control": input.cacheControl }
        : undefined,
    },
  );
}
