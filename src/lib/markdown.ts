import { Lexer, type Token, type Tokens } from "marked";

export type MarkdownBlock =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "code"; text: string }
  | { type: "blockquote"; text: string }
  | { type: "hr" };

function safeText(value: string | undefined | null): string {
  return typeof value === "string" ? value : "";
}

function inlineText(token: Tokens.Generic): string {
  if (!("tokens" in token) || !token.tokens) {
    return safeText("text" in token ? (token.text as string | undefined) : "");
  }

  return token.tokens
    .map((child) => {
      if (child.type === "text") {
        return safeText(child.text);
      }

      if (child.type === "strong" || child.type === "em") {
        return inlineText(child);
      }

      if (child.type === "codespan") {
        return safeText(child.text);
      }

      if (child.type === "link") {
        return safeText(child.text);
      }

      return "";
    })
    .join("");
}

function paragraphText(token: Tokens.Paragraph): string {
  return inlineText(token);
}

function tableCellText(cell: Tokens.TableCell): string {
  if (cell.tokens) {
    return cell.tokens
      .map((child) => {
        if (child.type === "text") {
          return safeText(child.text);
        }

        return inlineText(child as Tokens.Generic);
      })
      .join("");
  }

  return safeText(cell.text);
}

function listItems(token: Tokens.List): string[] {
  return token.items.map((item) => {
    if ("tokens" in item && item.tokens) {
      return item.tokens
        .map((child) => {
          if (child.type === "text") {
            return safeText(child.text);
          }

          if (child.type === "paragraph") {
            return paragraphText(child as Tokens.Paragraph);
          }

          return inlineText(child as Tokens.Generic);
        })
        .join(" ")
        .trim();
    }

    return "text" in item && typeof item.text === "string" ? item.text : "";
  });
}

export function parseMarkdown(content: string): MarkdownBlock[] {
  const tokens = Lexer.lex(content);
  const blocks: MarkdownBlock[] = [];

  for (const token of tokens as Token[]) {
    switch (token.type) {
      case "heading": {
        const heading = token as Tokens.Heading;
        blocks.push({
          type: "heading",
          level: heading.depth,
          text: inlineText(heading),
        });
        break;
      }
      case "paragraph":
        blocks.push({
          type: "paragraph",
          text: paragraphText(token as Tokens.Paragraph),
        });
        break;
      case "list": {
        const list = token as Tokens.List;
        blocks.push({
          type: "list",
          ordered: list.ordered ?? false,
          items: listItems(list),
        });
        break;
      }
      case "code": {
        const code = token as Tokens.Code;
        blocks.push({
          type: "code",
          text: safeText(code.text).trimEnd(),
        });
        break;
      }
      case "blockquote": {
        const blockquote = token as Tokens.Blockquote;
        blocks.push({
          type: "blockquote",
          text: blockquote.tokens
            ? blockquote.tokens
                .map((child) => {
                  if (child.type === "paragraph") {
                    return paragraphText(child as Tokens.Paragraph);
                  }

                  return inlineText(child as Tokens.Generic);
                })
                .join(" ")
            : safeText(blockquote.text),
        });
        break;
      }
      case "hr":
        blocks.push({ type: "hr" });
        break;
      case "table": {
        const table = token as Tokens.Table;
        blocks.push({
          type: "table",
          headers: table.header.map((cell) => tableCellText(cell)),
          rows: table.rows.map((row) =>
            row.map((cell) => tableCellText(cell)),
          ),
        });
        break;
      }
      default:
        break;
    }
  }

  return normalizeBlocks(blocks);
}

function normalizeBlocks(blocks: MarkdownBlock[]): MarkdownBlock[] {
  return blocks.map((block) => {
    switch (block.type) {
      case "heading":
      case "paragraph":
      case "blockquote":
      case "code":
        return { ...block, text: safeText(block.text) };
      case "list":
        return {
          ...block,
          items: block.items.map((item) => safeText(item)),
        };
      case "table":
        return {
          ...block,
          headers: block.headers.map((header) => safeText(header)),
          rows: block.rows.map((row) => row.map((cell) => safeText(cell))),
        };
      default:
        return block;
    }
  });
}

export function blocksToPlainText(blocks: MarkdownBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "heading":
        case "paragraph":
        case "blockquote":
        case "code":
          return block.text;
        case "list":
          return block.items.join(" ");
        case "table":
          return [
            block.headers.join(" "),
            ...block.rows.map((row) => row.join(" ")),
          ].join(" ");
        case "hr":
          return "";
        default:
          return "";
      }
    })
    .filter(Boolean)
    .join(" ");
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}
