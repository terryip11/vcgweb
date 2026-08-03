import Link from "next/link";
import { LOAN_CATEGORY_LABELS } from "@/lib/admin/constants";
import type { AffiliateCommission, AffiliateDashboardStats } from "@/types";
import type { LoanCategory } from "@/types";

function formatHkd(amount?: number) {
  if (amount == null) return "—";
  return `HK$${amount.toLocaleString("zh-HK", { minimumFractionDigits: 0 })}`;
}

export default function AffiliateStatsOverview({
  stats,
  commissions,
}: {
  stats: AffiliateDashboardStats;
  commissions: AffiliateCommission[];
}) {
  const cards = [
    {
      label: "總點擊（香港 IP）",
      value: stats.totalClicks,
      sub: `本週 +${stats.weekClicks}`,
    },
    {
      label: "總查詢（香港 IP）",
      value: stats.totalLeads,
      sub: `本週 +${stats.weekLeads}`,
    },
    {
      label: "本月查詢（香港 IP）",
      value: stats.monthLeads,
      sub: stats.commissionCplHkd
        ? `CPL ${formatHkd(stats.commissionCplHkd)}`
        : "待設定 CPL",
    },
    {
      label: "待結算（估算）",
      value: formatHkd(stats.estimatedPendingHkd),
      sub: `CPL 估算 · 已結算 ${formatHkd(stats.paidTotalHkd)}`,
      isText: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-semibold text-slate-500">{card.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {"isText" in card && card.isText ? card.value : card.value}
            </p>
            <p className="mt-1 text-xs text-slate-400">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900">最近有效查詢（香港 IP）</h2>
          {stats.recentLeads.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">暫無帶 ref 的查詢</p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-100">
              {stats.recentLeads.map((lead) => (
                <li key={lead.id} className="py-3">
                  <p className="font-medium text-slate-900">{lead.name}</p>
                  <p className="text-xs text-slate-500">
                    {lead.loanCategory
                      ? LOAN_CATEGORY_LABELS[lead.loanCategory as LoanCategory] ??
                        lead.loanCategory
                      : "查詢"}
                    {" · "}
                    {new Date(lead.createdAt).toLocaleDateString("zh-HK")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900">結算記錄</h2>
          {commissions.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              暫無結算記錄。VCG 每月人工對賬後更新。
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {commissions.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-slate-900">{c.periodLabel}</p>
                    <p className="text-xs text-slate-500">
                      {c.leadCount} 宗 ·{" "}
                      {c.status === "paid"
                        ? "已支付"
                        : c.status === "pending"
                          ? "待支付"
                          : "已作廢"}
                    </p>
                  </div>
                  <p className="font-bold text-teal-700">
                    {formatHkd(c.amountHkd)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-400">
        統計僅包含香港 IP 的點擊及查詢（海外或 VPN 流量不計入）。同一香港 IP
        對同一 ref 連結 24 小時內只計 1 次有效點擊；同一電話 24 小時內只計 1 宗有效查詢。
        「待結算（估算）」僅含 CPL 查詢佣金，不含 CPA 成功批核 1% 獎賞（滿 3 個月觀察期後人工核實）。
        實際佣金以 VCG 月結對賬及書面協議為準。如有疑問請{" "}
        <Link href="/partner#apply" className="text-teal-600 hover:underline">
          聯絡我們
        </Link>
        。
      </p>
    </div>
  );
}
