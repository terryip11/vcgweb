import AdminErrorBanner from "@/components/admin/AdminErrorBanner";
import ExportLeadsButton from "@/components/admin/ExportLeadsButton";
import LeadsPagination from "@/components/admin/LeadsPagination";
import LeadsTable from "@/components/admin/LeadsTable";
import {
  LEAD_STATUSES,
  LEAD_SOURCE_FILTER_OPTIONS,
  LEAD_STATUS_LABELS,
} from "@/lib/admin/constants";
import { requireAdmin } from "@/lib/admin/auth";
import { queryAdminLeads } from "@/lib/supabase/admin";

interface LeadsPageProps {
  searchParams: Promise<{
    status?: string;
    source?: string;
    q?: string;
    ref?: string;
    page?: string;
  }>;
}

const PAGE_SIZE = 20;

export default async function AdminLeadsPage({ searchParams }: LeadsPageProps) {
  const { supabase } = await requireAdmin();
  const params = await searchParams;
  const status = params.status ?? "all";
  const source = params.source ?? "all";
  const q = params.q ?? "";
  const referralCode = params.ref?.trim().toUpperCase() ?? "";
  const page = Math.max(1, Number(params.page ?? "1") || 1);

  const result = await queryAdminLeads(supabase, {
    status,
    source,
    search: q,
    referralCode: referralCode || undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  const leads = result.data?.leads ?? [];
  const total = result.data?.total ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">客戶查詢</h1>
          <p className="mt-1 text-sm text-slate-500">
            管理所有透過網站提交的貸款查詢
          </p>
        </div>
        <ExportLeadsButton
          status={status}
          source={source}
          q={q}
          referralCode={referralCode}
        />
      </div>

      {result.error && <AdminErrorBanner message={result.error} />}

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
          <div className="lg:w-36">
            <label
              htmlFor="ref"
              className="mb-1 block text-xs font-semibold text-slate-500"
            >
              推廣 ref
            </label>
            <input
              id="ref"
              name="ref"
              defaultValue={referralCode}
              placeholder="VCGKOL01"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm uppercase outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
          >
            篩選
          </button>
        </form>
      </div>

      <p className="text-sm text-slate-500">共 {total} 筆結果</p>
      <LeadsTable leads={leads} crud />
      <LeadsPagination
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        basePath="/admin/leads"
        searchParams={{ status, source, q, ref: referralCode || undefined }}
      />
    </div>
  );
}
