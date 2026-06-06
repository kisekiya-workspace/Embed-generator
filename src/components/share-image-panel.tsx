"use client";

import { useState } from "react";

type ShareImagePanelProps = {
  id: string;
  title: string;
  url: string;
  previewKey: number;
};

async function fetchImageBlob(id: string, previewKey: number): Promise<Blob> {
  const response = await fetch(`/api/og/${id}?v=${previewKey}`);
  if (!response.ok) {
    throw new Error("Failed to load image.");
  }
  return response.blob();
}

export function ShareImagePanel({
  id,
  title,
  url,
  previewKey,
}: ShareImagePanelProps) {
  const [shareError, setShareError] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const imageSrc = `/api/og/${id}?v=${previewKey}`;
  const fileName = `${(title || "embed").replace(/[^\w.-]+/g, "-")}.png`;

  async function handleShareImage() {
    setShareError(null);
    setIsSharing(true);

    try {
      const blob = await fetchImageBlob(id, previewKey);
      const file = new File([blob], fileName, { type: "image/png" });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: title || "Shared content",
        });
        return;
      }

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(link.href);
      setShareError(
        "Share not supported here — image downloaded instead. Attach it in WhatsApp.",
      );
    } catch (shareFailure) {
      if (shareFailure instanceof Error && shareFailure.name === "AbortError") {
        return;
      }

      setShareError(
        shareFailure instanceof Error
          ? shareFailure.message
          : "Could not share image.",
      );
    } finally {
      setIsSharing(false);
    }
  }

  async function handleDownload() {
    setShareError(null);

    try {
      const blob = await fetchImageBlob(id, previewKey);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (downloadError) {
      setShareError(
        downloadError instanceof Error
          ? downloadError.message
          : "Could not download image.",
      );
    }
  }

  async function handleCopyLink() {
    await navigator.clipboard.writeText(url);
    setLinkCopied(true);
    window.setTimeout(() => setLinkCopied(false), 2000);
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border-2 border-blue-500/30 bg-white p-6 dark:border-blue-500/40 dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              Recommended for WhatsApp
            </p>
            <h2 className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Share as image
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Sends full-width in chat like a screenshot. Link previews stay
              small — this is the ChatGPT-style fix.
            </p>
          </div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={title || "Formatted preview"}
          className="mt-4 w-full rounded-xl border border-zinc-200 shadow-sm dark:border-zinc-700"
        />

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleShareImage}
            disabled={isSharing}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
          >
            {isSharing ? "Preparing..." : "Share image"}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            Download PNG
          </button>
        </div>

        {shareError ? (
          <p className="mt-3 text-sm text-amber-700 dark:text-amber-300">
            {shareError}
          </p>
        ) : null}

        <p className="mt-3 text-xs text-zinc-500">
          On mobile: Share image → pick WhatsApp → sends as photo. On desktop:
          download PNG → drag into chat.
        </p>
      </div>

      <details className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <summary className="cursor-pointer text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Optional: share as link (small preview in WhatsApp)
        </summary>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          Links work but WhatsApp shows a tiny thumbnail. Use only if you need a
          URL, not maximum readability.
        </p>
        <div className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm break-all text-zinc-800 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100">
          {url}
        </div>
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCopyLink}
            className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            {linkCopied ? "Copied" : "Copy link"}
          </button>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            Open page
          </a>
        </div>
      </details>
    </div>
  );
}
