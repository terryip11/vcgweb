import Link from "next/link";
import type { AffiliateTopPerformer } from "@/types";

export default function AffiliatesTopPerformers({
  performers,
}: {
  performers: AffiliateTopPerformer[];
}) {
  if (performers.length === 0) return null;

  return (
    <div className="rounded-2xl border border-teal-100 bg-teal-50/50 p-5 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-slate-900">本週成效 Top {performers.length}</h2>
        <span className="text-xs text-slate-500">僅香港 IP · 按本週查詢排序</span>
      </div>
      <ul className="space-y-2">
        {performers.map((p, index) => (
          <li
            key={p.referralCode}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white px-4 py-3 text-sm"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-900">{p.partnerName}</p>
                <code className="text-xs text-teal-700">ref={p.referralCode}</code>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="font-bold text-blue-600">{p.weekLeads} 本週查詢</span>
              <span className="text-slate-500">{p.weekClicks} 本週點擊</span>
              <Link
                href={`/admin/leads?ref=${encodeURIComponent(p.referralCode)}`}
                className="font-semibold text-blue-600 hover:underline"
              >
                查詢 →
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
