import Link from "next/link";
import type { ReactNode } from "react";

function renderInline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const linkRe = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRe.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    const href = match[2];
    const isInternal = href.startsWith("/");
    parts.push(
      isInternal ? (
        <Link key={match.index} href={href} className="font-semibold text-blue-600 hover:underline">
          {match[1]}
        </Link>
      ) : (
        <a
          key={match.index}
          href={href}
          className="font-semibold text-blue-600 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {match[1]}
        </a>
      ),
    );
    last = match.index + match[0].length;
  }

  if (last < text.length) parts.push(text.slice(last));
  return parts.length ? parts : [text];
}

/** 簡易 Markdown 渲染（## / ### / - / 表格行 / 段落） */
export function parseBlogBody(body: string): ReactNode {
  const blocks = body.trim().split(/\n\n+/);
  const nodes: ReactNode[] = [];

  blocks.forEach((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return;

    if (trimmed.startsWith("## ")) {
      nodes.push(
        <h2 key={i} className="mt-8 text-xl font-bold text-slate-900 first:mt-0">
          {renderInline(trimmed.slice(3))}
        </h2>,
      );
      return;
    }

    if (trimmed.startsWith("### ")) {
      nodes.push(
        <h3 key={i} className="mt-6 text-lg font-bold text-slate-900">
          {renderInline(trimmed.slice(4))}
        </h3>,
      );
      return;
    }

    if (trimmed.startsWith("|")) {
      const rows = trimmed.split("\n").filter((r) => r.trim().startsWith("|"));
      const dataRows = rows.filter((r) => !/^\|[\s\-:|]+\|$/.test(r.trim()));
      nodes.push(
        <div key={i} className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-sm">
            <tbody>
              {dataRows.map((row, ri) => {
                const cells = row
                  .split("|")
                  .slice(1, -1)
                  .map((c) => c.trim());
                const Tag = ri === 0 ? "th" : "td";
                return (
                  <tr
                    key={ri}
                    className={ri === 0 ? "bg-slate-50" : "border-t border-slate-100"}
                  >
                    {cells.map((cell, ci) => (
                      <Tag
                        key={ci}
                        className={`px-4 py-2 text-left ${Tag === "th" ? "font-semibold text-slate-800" : "text-slate-600"}`}
                      >
                        {renderInline(cell)}
                      </Tag>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>,
      );
      return;
    }

    if (trimmed.split("\n").every((line) => line.startsWith("- "))) {
      nodes.push(
        <ul key={i} className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
          {trimmed.split("\n").map((line, li) => (
            <li key={li}>{renderInline(line.slice(2))}</li>
          ))}
        </ul>,
      );
      return;
    }

    nodes.push(
      <p key={i} className="mt-4 leading-relaxed text-slate-700">
        {renderInline(trimmed.replace(/\n/g, " "))}
      </p>,
    );
  });

  return <>{nodes}</>;
}
