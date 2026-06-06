export const THEME_IDS = [
  "light",
  "dark",
  "chatgpt",
  "ocean",
  "sunset",
] as const;

export type OgThemeId = (typeof THEME_IDS)[number];

export type OgPalette = {
  background: string;
  card: string;
  text: string;
  muted: string;
  accent: string;
  border: string;
  codeBg: string;
  headerBg: string;
  headerText: string;
};

export const ogThemes: Record<OgThemeId, OgPalette> = {
  light: {
    background: "#ffffff",
    card: "#ffffff",
    text: "#18181b",
    muted: "#71717a",
    accent: "#2563eb",
    border: "#e4e4e7",
    codeBg: "#f4f4f5",
    headerBg: "#2563eb",
    headerText: "#ffffff",
  },
  dark: {
    background: "#18181b",
    card: "#18181b",
    text: "#fafafa",
    muted: "#a1a1aa",
    accent: "#60a5fa",
    border: "#3f3f46",
    codeBg: "#27272a",
    headerBg: "#2563eb",
    headerText: "#ffffff",
  },
  chatgpt: {
    background: "#ffffff",
    card: "#ffffff",
    text: "#0d0d0d",
    muted: "#6e6e80",
    accent: "#10a37f",
    border: "#e5e5e5",
    codeBg: "#f7f7f8",
    headerBg: "#f7f7f8",
    headerText: "#0d0d0d",
  },
  ocean: {
    background: "#0f172a",
    card: "#1e293b",
    text: "#f8fafc",
    muted: "#94a3b8",
    accent: "#22d3ee",
    border: "#334155",
    codeBg: "#0f172a",
    headerBg: "#0891b2",
    headerText: "#ffffff",
  },
  sunset: {
    background: "#fff7ed",
    card: "#ffffff",
    text: "#431407",
    muted: "#9a3412",
    accent: "#ea580c",
    border: "#fed7aa",
    codeBg: "#ffedd5",
    headerBg: "#ea580c",
    headerText: "#ffffff",
  },
};

export const themeCatalog = THEME_IDS.map((id) => ({
  id,
  name: id.charAt(0).toUpperCase() + id.slice(1),
  description:
    id === "chatgpt"
      ? "Clean minimal style inspired by chat UIs"
      : id === "ocean"
        ? "Dark teal for data-heavy cards"
        : id === "sunset"
          ? "Warm tones for friendly shares"
          : id === "dark"
            ? "Dark mode default"
            : "Light mode default",
}));

export function parseThemeId(value: string | undefined | null): OgThemeId {
  if (value && THEME_IDS.includes(value as OgThemeId)) {
    return value as OgThemeId;
  }

  return "dark";
}
