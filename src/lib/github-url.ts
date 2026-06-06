const PLACEHOLDER = "YOUR_USERNAME";

export function getGitHubUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_GITHUB_URL?.trim();

  if (!url || url.includes(PLACEHOLDER)) {
    return null;
  }

  return url;
}
