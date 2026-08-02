import Link from "next/link";
import ClickStatsPanel from "@/components/admin/ClickStatsPanel";
import LeadsTable from "@/components/admin/LeadsTable";
import { requireAdmin } from "@/lib/admin/auth";
import {
  getAdminClickStats,
  getAdminDashboardStats,
  getAdminLeads,
} from "@/lib/supabase/admin";

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();
  const [stats, recentLeads, clickStats] = await Promise.all([
    getAdminDashboardStats(supabase),
    getAdminLeads(supabase, { limit: 8 }),
    getAdminClickStats(supabase),
  ]);

  const statCards = [
    { label: "今日新查詢", value: stats.todayNew, color: "text-blue-600" },
    { label: "待跟進", value: stats.pending, color: "text-amber-600" },
    { label: "本週查詢", value: stats.weekTotal, color: "text-slate-900" },
    { label: "成交率", value: `${stats.conversionRate}%`, color: "text-emerald-600" },
  ];

  const sourceEntries = Object.entries(stats.bySource).sort(
    (a, b) => b[1] - a[1],
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">概覽</h1>
        <p className="mt-1 text-sm text-slate-500">
          共 {stats.total} 筆查詢記錄
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className={`mt-2 text-3xl font-bold ${card.color}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {sourceEntries.length > 0 && (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-bold text-slate-900">查詢來源</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {sourceEntries.map(([source, count]) => (
              <div
                key={source}
                className="rounded-xl bg-slate-50 px-4 py-3 text-sm"
              >
                <p className="font-medium text-slate-900">{source}</p>
                <p className="text-xs text-slate-500">{count} 筆</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">點擊概覽</h2>
          <Link
            href="/admin/analytics"
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            詳細分析 →
          </Link>
        </div>
        <ClickStatsPanel stats={clickStats} />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">最新查詢</h2>
          <Link
            href="/admin/leads"
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            查看全部 →
          </Link>
        </div>
        <LeadsTable leads={recentLeads} />
      </div>
    </div>
  );
}
