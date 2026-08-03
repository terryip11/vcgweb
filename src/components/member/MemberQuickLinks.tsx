"use client";

import Link from "next/link";

const GATED_PATHS = new Set(["/sme", "/funds"]);

export interface QuickLinkItem {
  href: string;
  title: string;
  desc: string;
}

export default function MemberQuickLinks({
  links,
  hasValidPhone,
}: {
  links: readonly QuickLinkItem[];
  hasValidPhone: boolean;
}) {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      {links.map((link) => {
        const gated = GATED_PATHS.has(link.href) && !hasValidPhone;

        if (gated) {
          return (
            <div
              key={link.href}
              className="rounded-2xl border border-slate-200 bg-slate-100/80 p-5 opacity-90"
              aria-disabled="true"
            >
              <p className="font-bold text-slate-500">{link.title}</p>
              <p className="mt-1 text-sm text-slate-400">{link.desc}</p>
              <p className="mt-3 text-xs font-medium text-amber-700">
                請先在左側填寫並儲存有效香港電話，方可使用此功能
              </p>
            </div>
          );
        }

        return (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-2xl border border-slate-100 bg-slate-50 p-5 transition hover:border-blue-200 hover:bg-blue-50/50"
          >
            <p className="font-bold text-slate-900">{link.title}</p>
            <p className="mt-1 text-sm text-slate-500">{link.desc}</p>
          </Link>
        );
      })}
    </div>
  );
}
