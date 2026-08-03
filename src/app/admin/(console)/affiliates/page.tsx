import AdminErrorBanner from "@/components/admin/AdminErrorBanner";
import AdminPendingAffiliateBanner from "@/components/admin/AdminPendingAffiliateBanner";
import AffiliatesCrud from "@/components/admin/AffiliatesCrud";
import AffiliatesTopPerformers from "@/components/admin/AffiliatesTopPerformers";
import LeadsPagination from "@/components/admin/LeadsPagination";
import { requireAdmin } from "@/lib/admin/auth";
import {
  countPendingAffiliatePartners,
  getAdminAffiliateTopPerformers,
  queryAdminAffiliatePartnersPage,
  type AffiliatePartnerSort,
} from "@/lib/supabase/admin";

interface AffiliatesPageProps {
  searchParams: Promise<{
    status?: string;
    q?: string;
    page?: string;
    sort?: string;
  }>;
}

const PAGE_SIZE = 20;

const SORT_OPTIONS: { value: AffiliatePartnerSort; label: string }[] = [
  { value: "newest", label: "最新申請" },
  { value: "week_leads", label: "本週查詢最多" },
  { value: "total_leads", label: "總查詢最多" },
  { value: "total_clicks", label: "總點擊最多" },
  { value: "conversion", label: "轉化率最高" },
];

function parseSort(value?: string): AffiliatePartnerSort {
  const allowed = SORT_OPTIONS.map((o) => o.value);
  if (value && allowed.includes(value as AffiliatePartnerSort)) {
    return value as AffiliatePartnerSort;
  }
  return "newest";
}

export default async function AdminAffiliatesPage({
  searchParams,
}: AffiliatesPageProps) {
  const { supabase } = await requireAdmin();
  const params = await searchParams;
  const status = params.status ?? "all";
  const q = params.q ?? "";
  const sort = parseSort(params.sort);
  const page = Math.max(1, Number(params.page ?? "1") || 1);

  const [result, pendingCount, topPerformers] = await Promise.all([
    queryAdminAffiliatePartnersPage(supabase, {
      status,
      search: q,
      page,
      pageSize: PAGE_SIZE,
      sort,
    }),
    countPendingAffiliatePartners(supabase),
    getAdminAffiliateTopPerformers(supabase, 5),
  ]);

  const partners = result.data?.partners ?? [];
  const total = result.data?.total ?? 0;
  const statsByCode = result.data?.statsByCode ?? {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">推廣夥伴</h1>
        <p className="mt-1 text-sm text-slate-500">
          審核 Affiliate 申請、查看推廣成效、設定 ref 代碼及 CPL 佣金。點擊與查詢
          <strong className="font-semibold text-slate-700">僅統計香港 IP</strong>
          。
        </p>
      </div>

      <AdminPendingAffiliateBanner pendingCount={pendingCount} />

      <AffiliatesTopPerformers performers={topPerformers} />

      {result.error && <AdminErrorBanner message={result.error} />}

      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <form className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="flex-1">
            <label
              htmlFor="affiliate-search"
              className="mb-1 block text-xs font-semibold text-slate-500"
            >
              搜尋
            </label>
            <input
              id="affiliate-search"
              name="q"
              defaultValue={q}
              placeholder="姓名、電話、電郵或 ref 代碼"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="lg:w-44">
            <label
              htmlFor="affiliate-status"
              className="mb-1 block text-xs font-semibold text-slate-500"
            >
              狀態
            </label>
            <select
              id="affiliate-status"
              name="status"
              defaultValue={status}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">全部狀態</option>
              <option value="pending">待審核</option>
              <option value="approved">已批准</option>
              <option value="rejected">已拒絕</option>
              <option value="suspended">已暫停</option>
            </select>
          </div>
          <div className="lg:w-48">
            <label
              htmlFor="affiliate-sort"
              className="mb-1 block text-xs font-semibold text-slate-500"
            >
              排序
            </label>
            <select
              id="affiliate-sort"
              name="sort"
              defaultValue={sort}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
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

      <p className="text-sm text-slate-500">共 {total} 位夥伴</p>
      <AffiliatesCrud partners={partners} statsByCode={statsByCode} />
      <LeadsPagination
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        basePath="/admin/affiliates"
        searchParams={{ status, q, sort }}
      />
    </div>
  );
}
