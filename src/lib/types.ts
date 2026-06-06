export type EmbedTheme = "light" | "dark";

export interface EmbedRecord {
  title: string;
  content: string;
  theme: EmbedTheme;
  createdAt: number;
}

export interface CreateEmbedRequest {
  title?: string;
  content: string;
  theme?: EmbedTheme;
}

export interface CreateEmbedResponse {
  id: string;
  url: string;
  preview?: string;
  imageUrl?: string;
}
