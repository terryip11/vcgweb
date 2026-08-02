import Link from "next/link";
import ExportLeadsButton from "@/components/admin/ExportLeadsButton";
import LeadsTable from "@/components/admin/LeadsTable";
import { LEAD_STATUSES, LEAD_SOURCE_FILTER_OPTIONS, LEAD_STATUS_LABELS } from "@/lib/admin/constants";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminLeads } from "@/lib/supabase/admin";

interface LeadsPageProps {
  searchParams: Promise<{ status?: string; source?: string; q?: string }>;
}

export default async function AdminLeadsPage({ searchParams }: LeadsPageProps) {
  const { supabase } = await requireAdmin();
  const { status = "all", source = "all", q = "" } = await searchParams;
  const leads = await getAdminLeads(supabase, { status, source, search: q });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">客戶查詢</h1>
          <p className="mt-1 text-sm text-slate-500">
            管理所有透過網站提交的貸款查詢
          </p>
        </div>
        <ExportLeadsButton status={status} source={source} q={q} />
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <form className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="flex-1">
            <label
              htmlFor="search"
              className="mb-1 block text-xs font-semibold text-slate-500"
            >
              搜尋
            </label>
            <input
              id="search"
              name="q"
              defaultValue={q}
              placeholder="姓名、電話或電郵"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="lg:w-44">
            <label
              htmlFor="source"
              className="mb-1 block text-xs font-semibold text-slate-500"
            >
              來源
            </label>
            <select
              id="source"
              name="source"
              defaultValue={source}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              {LEAD_SOURCE_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="lg:w-44">
            <label
              htmlFor="status"
              className="mb-1 block text-xs font-semibold text-slate-500"
            >
              狀態
            </label>
            <select
              id="status"
              name="status"
              defaultValue={status}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">全部</option>
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {LEAD_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
          >
            篩選
          </button>
        </form>
      </div>

      <p className="text-sm text-slate-500">共 {leads.length} 筆結果</p>
      <LeadsTable leads={leads} />
    </div>
  );
}
