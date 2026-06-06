import { CreateForm } from "@/components/create-form";

export default function Home() {
  return (
    <div className="min-h-full bg-zinc-50 dark:bg-zinc-950">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
        <section className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
            Embed Generator
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Turn markdown into a shareable image for chat
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            WhatsApp cannot render markdown. Links only show a tiny thumbnail.
            Generate a formatted PNG and share it as a photo — full width, like a
            ChatGPT screenshot.
          </p>
        </section>

        <CreateForm />
      </main>
    </div>
  );
}
