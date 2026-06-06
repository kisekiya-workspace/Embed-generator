import type { MarkdownBlock } from "@/lib/markdown";

function headingClass(level: number): string {
  if (level === 1) return "text-3xl font-bold";
  if (level === 2) return "text-2xl font-semibold";
  if (level === 3) return "text-xl font-semibold";
  return "text-lg font-semibold";
}

export function MarkdownContent({ blocks }: { blocks: MarkdownBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return (
              <h2
                key={`heading-${index}`}
                className={`${headingClass(block.level)} text-zinc-900 dark:text-zinc-50`}
              >
                {block.text}
              </h2>
            );
          case "paragraph":
            return (
              <p
                key={`paragraph-${index}`}
                className="text-base leading-7 text-zinc-700 dark:text-zinc-300"
              >
                {block.text}
              </p>
            );
          case "list":
            return block.ordered ? (
              <ol
                key={`list-${index}`}
                className="list-decimal space-y-2 pl-6 text-zinc-700 dark:text-zinc-300"
              >
                {block.items.map((item, itemIndex) => (
                  <li key={`ordered-${index}-${itemIndex}`}>{item}</li>
                ))}
              </ol>
            ) : (
              <ul
                key={`list-${index}`}
                className="list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300"
              >
                {block.items.map((item, itemIndex) => (
                  <li key={`unordered-${index}-${itemIndex}`}>{item}</li>
                ))}
              </ul>
            );
          case "table":
            return (
              <div
                key={`table-${index}`}
                className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800"
              >
                <table className="min-w-full border-collapse text-left text-sm">
                  <thead className="bg-zinc-100 dark:bg-zinc-800">
                    <tr>
                      {block.headers.map((header, headerIndex) => (
                        <th
                          key={`th-${index}-${headerIndex}`}
                          className="border-b border-zinc-200 px-4 py-3 font-semibold text-zinc-900 dark:border-zinc-700 dark:text-zinc-50"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, rowIndex) => (
                      <tr
                        key={`tr-${index}-${rowIndex}`}
                        className="border-b border-zinc-100 last:border-b-0 dark:border-zinc-800"
                      >
                        {row.map((cell, cellIndex) => (
                          <td
                            key={`td-${index}-${rowIndex}-${cellIndex}`}
                            className="px-4 py-3 text-zinc-700 dark:text-zinc-300"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "code":
            return (
              <pre
                key={`code-${index}`}
                className="overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
              >
                {block.text}
              </pre>
            );
          case "blockquote":
            return (
              <blockquote
                key={`quote-${index}`}
                className="border-l-4 border-blue-500 pl-4 italic text-zinc-600 dark:text-zinc-400"
              >
                {block.text}
              </blockquote>
            );
          case "hr":
            return (
              <hr
                key={`hr-${index}`}
                className="border-zinc-200 dark:border-zinc-800"
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
