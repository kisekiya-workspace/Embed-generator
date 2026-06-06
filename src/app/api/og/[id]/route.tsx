import { renderOgImage } from "@/lib/render-og-image";
import { getEmbed } from "@/lib/store";

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

    return renderOgImage({
      title: embed.title ?? "",
      content: embed.content,
      theme: embed.theme === "light" ? "light" : "dark",
      cacheControl: "public, immutable, no-transform, max-age=31536000",
    });
  } catch (error) {
    console.error(`OG image failed for ${id}:`, error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
