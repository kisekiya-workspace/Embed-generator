import Link from "next/link";
import { getGitHubUrl } from "@/lib/github-url";

export function SiteFooter() {
  const githubUrl = getGitHubUrl();
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-zinc-900 dark:text-zinc-50">
            Embed & Image Generator
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            Open source · MIT · Built for agents, chats, and keyboards
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link
            href="/docs"
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            API docs
          </Link>
          <a
            href="/api"
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            API JSON
          </a>
          {githubUrl ? (
            <a
              href={githubUrl}
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              GitHub
            </a>
          ) : null}
          <Link
            href="/docs#contributing"
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Contribute
          </Link>
        </div>
      </div>
    </footer>
  );
}
