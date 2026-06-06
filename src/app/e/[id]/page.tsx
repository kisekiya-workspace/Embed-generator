import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownContent } from "@/components/markdown-content";
import { getBaseUrl } from "@/lib/base-url";
import { parseMarkdown } from "@/lib/markdown";
import { formatChatDescription } from "@/lib/og-description";
import { getEmbed } from "@/lib/store";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const embed = await getEmbed(id);

  if (!embed) {
    return {
      title: "Embed not found",
    };
  }

  const baseUrl = getBaseUrl();
  const blocks = parseMarkdown(embed.content);
  const title = embed.title || "Shared content";
  const description = formatChatDescription(blocks, {
    title,
    maxLength: 160,
  });
  const imageUrl = `${baseUrl}/api/og/${id}`;
  const pageUrl = `${baseUrl}/e/${id}`;

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    openGraph: {
      title,
      description,
      type: "website",
      url: pageUrl,
      siteName: "Embed Generator",
      locale: "en_US",
      images: [
        {
          url: imageUrl,
          secureUrl: imageUrl,
          width: 1200,
          height: 630,
          type: "image/png",
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: title,
      },
    },
    other: {
      "og:image:width": "1200",
      "og:image:height": "630",
    },
  };
}

export default async function EmbedPage({ params }: PageProps) {
  const { id } = await params;
  const embed = await getEmbed(id);

  if (!embed) {
    notFound();
  }

  const blocks = parseMarkdown(embed.content);

  return (
    <div className="min-h-full bg-zinc-50 dark:bg-zinc-950">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-12">
        <div className="space-y-3">
          <Link
            href="/"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Create another embed
          </Link>
          {embed.title ? (
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {embed.title}
            </h1>
          ) : (
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Shared content
            </h1>
          )}
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Paste the link above in chat apps to show a formatted preview card.
          </p>
        </div>

        <article className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <MarkdownContent blocks={blocks} />
        </article>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Preview image
          </h2>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/og/${id}`}
            alt={embed.title || "Embed preview"}
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800"
          />
        </section>
      </main>
    </div>
  );
}
