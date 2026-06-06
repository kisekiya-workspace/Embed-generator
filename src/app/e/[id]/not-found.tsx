import Link from "next/link";

export default function EmbedNotFound() {
  return (
    <div className="flex min-h-full items-center justify-center bg-zinc-50 px-6 dark:bg-zinc-950">
      <div className="max-w-md space-y-4 text-center">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Link not found
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          This embed may have expired or the link is incorrect. Links are kept
          for 90 days.
        </p>
        <Link
          href="/"
          className="inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"
        >
          Create a new embed
        </Link>
      </div>
    </div>
  );
}
