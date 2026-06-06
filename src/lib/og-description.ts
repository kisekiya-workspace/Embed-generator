import type { MarkdownBlock } from "./markdown";
import { truncateText } from "./markdown";

function headerIndex(headers: string[], keywords: string[]): number {
  const normalized = headers.map((header) => header.toLowerCase().trim());
  return normalized.findIndex((header) =>
    keywords.some((keyword) => header.includes(keyword)),
  );
}

function formatTableRow(headers: string[], row: string[]): string {
  const nameIdx = headerIndex(headers, ["name", "player", "team", "title"]);
  const scoreIdx = headerIndex(headers, ["score", "points", "pts", "goals"]);
  const cityIdx = headerIndex(headers, ["city", "location", "place"]);
  const statusIdx = headerIndex(headers, ["status", "state", "result"]);

  const pick = (index: number) => (index >= 0 ? row[index]?.trim() : "");

  const name = pick(nameIdx);
  const score = pick(scoreIdx);
  const city = pick(cityIdx);
  const status = pick(statusIdx);

  const smartParts = [name, score, city, status].filter(Boolean);
  if (smartParts.length >= 2) {
    return smartParts.join(" · ");
  }

  const idIdx = headerIndex(headers, ["id", "#", "no"]);
  return row
    .filter((_, index) => index !== idIdx)
    .map((cell) => cell.trim())
    .filter(Boolean)
    .slice(0, 4)
    .join(" · ");
}

function formatTableDescription(
  block: Extract<MarkdownBlock, { type: "table" }>,
  maxRows = 3,
): string {
  const rows = block.rows.slice(0, maxRows).map((row) =>
    formatTableRow(block.headers, row),
  );
  const remaining = block.rows.length - maxRows;

  if (remaining > 0) {
    rows.push(`+${remaining} more`);
  }

  return rows.join("  |  ");
}

export function formatChatDescription(
  blocks: MarkdownBlock[],
  options?: { title?: string; maxLength?: number },
): string {
  const maxLength = options?.maxLength ?? 180;
  const title = options?.title?.trim().toLowerCase();
  const parts: string[] = [];

  for (const block of blocks) {
    switch (block.type) {
      case "table":
        parts.push(formatTableDescription(block));
        break;
      case "list":
        parts.push(
          ...block.items
            .slice(0, 4)
            .map((item) => item.trim())
            .filter(Boolean),
        );
        break;
      case "paragraph": {
        const text = block.text.trim();
        if (text && text.toLowerCase() !== title) {
          parts.push(text);
        }
        break;
      }
      case "heading": {
        const text = block.text.trim();
        if (text && text.toLowerCase() !== title) {
          parts.push(text);
        }
        break;
      }
      case "blockquote":
        parts.push(block.text.trim());
        break;
      default:
        break;
    }

    if (parts.join(" · ").length >= maxLength) {
      break;
    }
  }

  if (parts.length === 0) {
    return "Open link to view formatted content.";
  }

  const hasTable = blocks.some((block) => block.type === "table");
  const description = hasTable
    ? truncateText(parts[0] ?? parts.join(" · "), maxLength)
    : truncateText(parts.join(" · "), maxLength);

  return description;
}

export function hasPrimaryTable(blocks: MarkdownBlock[]): boolean {
  return blocks.some((block) => block.type === "table");
}

/** Tables belong in the OG image — skip og:description so chat apps don't show a text wall. */
export function shouldOmitDescription(blocks: MarkdownBlock[]): boolean {
  return hasPrimaryTable(blocks);
}

export function getOgDescription(
  blocks: MarkdownBlock[],
  options?: { title?: string },
): string | undefined {
  if (shouldOmitDescription(blocks)) {
    return undefined;
  }

  return formatChatDescription(blocks, {
    title: options?.title,
    maxLength: 160,
  });
}
