import Link from "next/link";
import { CreateForm } from "@/components/create-form";
import { SiteFooter } from "@/components/site-footer";
import { UseCases } from "@/components/use-cases";

export default function Home() {
  return (
    <div className="min-h-full bg-zinc-50 dark:bg-zinc-950">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-12">
        <section className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Open source
            </p>
            <span className="rounded-full bg-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              MIT · Embed + Image API
            </span>
          </div>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            Markdown to chat-ready images &amp; embed links
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Turn AI markdown into formatted PNGs for WhatsApp, Open Graph embeds
            for Discord, and HTTP APIs for agents and keyboards. One project,
            multiple outputs — use the UI, call the API, or self-host.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/docs"
              className="inline-flex h-11 items-center rounded-xl border border-zinc-300 px-5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              API docs
            </Link>
            <a
              href="/api"
              className="inline-flex h-11 items-center rounded-xl border border-zinc-300 px-5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              API discovery (JSON)
            </a>
          </div>
        </section>

        <CreateForm />
        <UseCases />
      </main>
      <SiteFooter />
    </div>
  );
}
