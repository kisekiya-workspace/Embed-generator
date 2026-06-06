"use client";

import { useState } from "react";
import { ShareImagePanel } from "@/components/share-image-panel";
import type { CreateEmbedResponse, EmbedTheme } from "@/lib/types";

const EXAMPLE_MARKDOWN = `## Team Scores

| ID | Name  | City      | Score | Status   |
| -- | ----- | --------- | ----- | -------- |
| 1  | Aria  | Mumbai    | 87    | Active   |
| 2  | Karan | Delhi     | 92    | Active   |
| 3  | Neha  | Pune      | 76    | Pending  |
| 4  | Ravi  | Ahmedabad | 84    | Active   |
| 5  | Meera | Jaipur    | 95    | Inactive |`;

export function CreateForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [theme, setTheme] = useState<EmbedTheme>("dark");
  const [result, setResult] = useState<CreateEmbedResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim() || undefined,
          content,
          theme,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create embed.");
      }

      setResult(data as CreateEmbedResponse);
      setPreviewKey(Date.now());
    } catch (submitError) {
      setResult(null);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to create embed.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function loadExample() {
    setTitle("Team Scores");
    setContent(EXAMPLE_MARKDOWN);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Title (optional)
          </label>
          <input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Football score, recipe summary, notes..."
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none ring-blue-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            maxLength={120}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="content"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Markdown content
            </label>
            <button
              type="button"
              onClick={loadExample}
              className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Load example
            </button>
          </div>
          <textarea
            id="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Paste the text your keyboard app generated..."
            rows={14}
            required
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 font-mono text-sm leading-6 text-zinc-900 outline-none ring-blue-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            maxLength={4096}
          />
          <p className="text-xs text-zinc-500">
            {content.length}/4096 characters
          </p>
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Preview theme
          </span>
          <div className="flex gap-3">
            {(["dark", "light"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTheme(option)}
                className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition ${
                  theme === option
                    ? "bg-blue-600 text-white"
                    : "border border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isLoading || !content.trim()}
          className="inline-flex h-12 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Generating..." : "Generate image"}
        </button>
      </form>

      <div className="space-y-5">
        {result ? (
          <ShareImagePanel
            id={result.id}
            title={title}
            url={result.url}
            previewKey={previewKey}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              Your formatted image will appear here
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Share it as a photo in WhatsApp for full-width display — not as a
              link.
            </p>
          </div>
        )}

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Keyboard app
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Return a PNG directly — insert as image in chat, not URL text.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs leading-6 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100">
            {`POST /api/keyboard?format=image
Content-Type: text/plain

<markdown>
→ image/png (attach in WhatsApp)`}
          </pre>
        </div>
      </div>
    </div>
  );
}
