const cases = [
  {
    title: "Chat apps (WhatsApp, iMessage)",
    description:
      "Render markdown to PNG and send as a photo. Full-width tables — not a tiny link thumbnail.",
    api: "POST /api/render?format=image",
    badge: "Image",
  },
  {
    title: "AI agents & automations",
    description:
      "Stateless render with base64 PNG in JSON. No database, no link — drop straight into agent output.",
    api: "POST /api/render?format=base64",
    badge: "Agent",
  },
  {
    title: "Link embed previews",
    description:
      "Short links with Open Graph cards for Discord, Slack, Telegram, and Twitter.",
    api: "POST /api/create",
    badge: "Embed",
  },
  {
    title: "Keyboards & custom skills",
    description:
      "HTTP skills can POST markdown and get a URL or PNG back. No fork required.",
    api: "POST /api/keyboard?format=image",
    badge: "Keyboard",
  },
  {
    title: "Self-host & fork",
    description:
      "MIT licensed. Deploy on Vercel + Upstash, or run locally with in-memory storage.",
    api: "GET /api",
    badge: "Open source",
  },
];

export function UseCases() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Use it your way
        </h2>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
          One tool, multiple outputs — image, embed link, or raw API for agents.
          Pick the mode that fits your app.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {cases.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              {item.badge}
            </span>
            <h3 className="mt-3 font-semibold text-zinc-900 dark:text-zinc-50">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {item.description}
            </p>
            <code className="mt-3 block rounded-lg bg-zinc-100 px-3 py-2 text-xs text-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
              {item.api}
            </code>
          </article>
        ))}
      </div>
    </section>
  );
}
