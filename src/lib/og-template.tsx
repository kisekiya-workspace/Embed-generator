import type { MarkdownBlock } from "./markdown";
import { hasPrimaryTable } from "./og-description";
import type { EmbedTheme } from "./types";
import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from "./constants";

const themes = {
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
} as const;

type Palette = (typeof themes)[keyof typeof themes];

function text(value: string | undefined | null): string {
  return typeof value === "string" ? value : "";
}

function tableFontSize(columnCount: number, fullBleed = false): number {
  if (fullBleed) {
    if (columnCount >= 5) return 20;
    if (columnCount >= 4) return 22;
    return 24;
  }

  if (columnCount >= 5) return 15;
  if (columnCount >= 4) return 17;
  return 19;
}

function renderTable(
  block: Extract<MarkdownBlock, { type: "table" }>,
  palette: Palette,
  index: number,
  fullBleed = false,
) {
  const columnCount = Math.max(block.headers.length, 1);
  const fontSize = tableFontSize(columnCount, fullBleed);
  const maxRows = fullBleed ? 7 : 8;
  const visibleRows = block.rows.slice(0, maxRows);

  const cellStyle = {
    display: "flex",
    flex: 1,
    padding: fullBleed ? "14px 16px" : "10px 12px",
    fontSize,
    lineHeight: 1.25,
    color: palette.text,
    alignItems: "center",
  } as const;

  return (
    <div
      key={`table-${index}`}
      style={{
        display: "flex",
        flexDirection: "column",
        flex: fullBleed ? 1 : undefined,
        border: fullBleed ? undefined : `1px solid ${palette.border}`,
        borderRadius: fullBleed ? 0 : 12,
        marginBottom: fullBleed ? 0 : 12,
      }}
    >
      <div
        style={{
          display: "flex",
          background: fullBleed ? palette.headerBg : palette.codeBg,
          borderBottom: `1px solid ${palette.border}`,
        }}
      >
        {block.headers.map((header, headerIndex) => (
          <div
            key={`th-${index}-${headerIndex}`}
            style={{
              ...cellStyle,
              fontWeight: 700,
              color: fullBleed ? palette.headerText : palette.text,
            }}
          >
            {text(header)}
          </div>
        ))}
      </div>
      {visibleRows.map((row, rowIndex) => (
        <div
          key={`tr-${index}-${rowIndex}`}
          style={{
            display: "flex",
            flex: fullBleed ? 1 : undefined,
            background: rowIndex % 2 === 1 ? palette.codeBg : palette.card,
            ...(rowIndex < visibleRows.length - 1
              ? { borderBottom: `1px solid ${palette.border}` }
              : {}),
          }}
        >
          {block.headers.map((_, cellIndex) => (
            <div
              key={`td-${index}-${rowIndex}-${cellIndex}`}
              style={cellStyle}
            >
              {text(row[cellIndex])}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function headingSize(level: number): number {
  if (level === 1) return 44;
  if (level === 2) return 36;
  if (level === 3) return 30;
  return 26;
}

function renderBlocks(
  blocks: MarkdownBlock[],
  palette: Palette,
  fullBleed = false,
) {
  const visibleBlocks = blocks.slice(0, 14);

  return visibleBlocks.map((block, index) => {
    switch (block.type) {
      case "heading":
        if (fullBleed) {
          return null;
        }

        return (
          <div
            key={`heading-${index}`}
            style={{
              display: "flex",
              fontSize: headingSize(block.level),
              fontWeight: 700,
              lineHeight: 1.2,
              color: palette.text,
              marginBottom: 12,
            }}
          >
            {text(block.text)}
          </div>
        );
      case "paragraph":
        return (
          <div
            key={`paragraph-${index}`}
            style={{
              display: "flex",
              fontSize: 24,
              lineHeight: 1.45,
              color: palette.text,
              marginBottom: 10,
            }}
          >
            {text(block.text)}
          </div>
        );
      case "list":
        return (
          <div
            key={`list-${index}`}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginBottom: 12,
            }}
          >
            {block.items.slice(0, 8).map((item, itemIndex) => (
              <div
                key={`list-item-${index}-${itemIndex}`}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  fontSize: 22,
                  lineHeight: 1.4,
                  color: palette.text,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    color: palette.accent,
                    fontWeight: 700,
                    minWidth: 24,
                  }}
                >
                  {block.ordered ? `${itemIndex + 1}.` : "•"}
                </div>
                <div style={{ display: "flex", flex: 1 }}>{text(item)}</div>
              </div>
            ))}
          </div>
        );
      case "table":
        return renderTable(block, palette, index, fullBleed);
      case "code":
        return (
          <div
            key={`code-${index}`}
            style={{
              display: "flex",
              fontSize: 20,
              lineHeight: 1.4,
              color: palette.text,
              background: palette.codeBg,
              border: `1px solid ${palette.border}`,
              borderRadius: 12,
              padding: "16px 18px",
              marginBottom: 12,
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
            }}
          >
            {text(block.text)}
          </div>
        );
      case "blockquote":
        return (
          <div
            key={`quote-${index}`}
            style={{
              display: "flex",
              fontSize: 22,
              lineHeight: 1.45,
              color: palette.muted,
              borderLeft: `4px solid ${palette.accent}`,
              paddingLeft: 16,
              marginBottom: 12,
            }}
          >
            {text(block.text)}
          </div>
        );
      case "hr":
        return (
          <div
            key={`hr-${index}`}
            style={{
              display: "flex",
              height: 1,
              background: palette.border,
              margin: "12px 0",
            }}
          />
        );
      default:
        return null;
    }
  });
}

function TablePoster({
  title,
  blocks,
  palette,
}: {
  title: string;
  blocks: MarkdownBlock[];
  palette: Palette;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        background: palette.background,
        fontFamily: "Inter",
      }}
    >
      {title ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "20px 28px",
            background: palette.headerBg,
            color: palette.headerText,
            fontSize: 32,
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          {text(title)}
        </div>
      ) : null}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {renderBlocks(blocks, palette, true)}
      </div>
    </div>
  );
}

function StandardCard({
  title,
  blocks,
  palette,
}: {
  title: string;
  blocks: MarkdownBlock[];
  palette: Palette;
}) {
  return (
    <div
      style={{
        display: "flex",
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        background: palette.background,
        padding: 48,
        fontFamily: "Inter",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          background: palette.card,
          border: `1px solid ${palette.border}`,
          borderRadius: 24,
          padding: "40px 44px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: palette.accent,
            }}
          >
            Embed Card
          </div>
          <div
            style={{
              display: "flex",
              width: 12,
              height: 12,
              borderRadius: 999,
              background: palette.accent,
            }}
          />
        </div>

        {title ? (
          <div
            style={{
              display: "flex",
              fontSize: 34,
              fontWeight: 700,
              color: palette.text,
              marginBottom: 24,
              lineHeight: 1.2,
            }}
          >
            {text(title)}
          </div>
        ) : null}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          {renderBlocks(blocks, palette, false)}
        </div>
      </div>
    </div>
  );
}

export function OgCard({
  title,
  blocks,
  theme,
}: {
  title: string;
  blocks: MarkdownBlock[];
  theme: EmbedTheme;
}) {
  const palette = themes[theme] ?? themes.dark;
  const fullBleed = hasPrimaryTable(blocks);

  if (fullBleed) {
    return <TablePoster title={title} blocks={blocks} palette={palette} />;
  }

  return <StandardCard title={title} blocks={blocks} palette={palette} />;
}
