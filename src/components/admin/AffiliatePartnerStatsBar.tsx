import Link from "next/link";
import type { AffiliatePartnerPerformanceStats } from "@/types";

function formatRate(rate: number | null) {
  if (rate == null) return "—";
  return `${rate}%`;
}

export default function AffiliatePartnerStatsBar({
  referralCode,
  stats,
}: {
  referralCode?: string;
  stats?: AffiliatePartnerPerformanceStats;
}) {
  if (!referralCode) {
    return (
      <p className="rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
        尚未設定 ref 代碼，批准後可追蹤香港 IP 成效
      </p>
    );
  }

  const s = stats ?? {
    totalClicks: 0,
    weekClicks: 0,
    totalLeads: 0,
    weekLeads: 0,
    monthLeads: 0,
    conversionRate: null,
  };

  const items = [
    { label: "總點擊", value: s.totalClicks, sub: `本週 +${s.weekClicks}` },
    { label: "總查詢", value: s.totalLeads, sub: `本週 +${s.weekLeads}` },
    { label: "本月查詢", value: s.monthLeads, sub: "香港 IP" },
    { label: "轉化率", value: formatRate(s.conversionRate), sub: "查詢 ÷ 點擊" },
  ];

  return (
    <div className="space-y-2">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              {item.label}
            </p>
            <p className="text-lg font-bold text-slate-900">{item.value}</p>
            <p className="text-[10px] text-slate-500">{item.sub}</p>
          </div>
        ))}
      </div>
      <Link
        href={`/admin/leads?ref=${encodeURIComponent(referralCode)}`}
        className="inline-flex text-xs font-semibold text-blue-600 hover:underline"
      >
        查看 ref={referralCode} 的查詢記錄 →
      </Link>
    </div>
  );
}
