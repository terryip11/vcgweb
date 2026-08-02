import AffiliatesTable from "@/components/admin/AffiliatesTable";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminAffiliatePartners } from "@/lib/supabase/admin";

interface AffiliatesPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminAffiliatesPage({
  searchParams,
}: AffiliatesPageProps) {
  const { supabase } = await requireAdmin();
  const { status = "all" } = await searchParams;
  const partners = await getAdminAffiliatePartners(supabase, status);

  const pendingCount = partners.filter((p) => p.status === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">推廣夥伴</h1>
        <p className="mt-1 text-sm text-slate-500">
          審核 Affiliate 申請、設定 ref 代碼。Phase 1 採人工 onboarding。
        </p>
        {pendingCount > 0 && (
          <p className="mt-2 text-sm font-medium text-amber-700">
            {pendingCount} 個待審核申請
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <form className="flex flex-wrap gap-3">
          <select
            name="status"
            defaultValue={status}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
          >
            <option value="all">全部狀態</option>
            <option value="pending">待審核</option>
            <option value="approved">已批准</option>
            <option value="rejected">已拒絕</option>
            <option value="suspended">已暫停</option>
          </select>
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
          >
            篩選
          </button>
        </form>
      </div>

      <p className="text-sm text-slate-500">共 {partners.length} 位夥伴</p>
      <AffiliatesTable partners={partners} />
    </div>
  );
}
