import { ImageResponse } from "next/og";
import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from "@/lib/constants";
import { parseMarkdown } from "@/lib/markdown";
import { OgCard } from "@/lib/og-template";
import { getEmbed } from "@/lib/store";

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

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  try {
    const embed = await getEmbed(id);

    if (!embed) {
      return new Response("Not found", { status: 404 });
    }

    const [interRegular, interBold] = await Promise.all([
      loadInterFont(400),
      loadInterFont(700),
    ]);
    const blocks = parseMarkdown(embed.content);

    return new ImageResponse(
      (
        <OgCard
          title={embed.title ?? ""}
          blocks={blocks}
          theme={embed.theme === "light" ? "light" : "dark"}
        />
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
        headers: {
          "Cache-Control":
            "public, immutable, no-transform, max-age=31536000",
        },
      },
    );
  } catch (error) {
    console.error(`OG image failed for ${id}:`, error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
