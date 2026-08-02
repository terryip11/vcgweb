import Link from "next/link";
import CampaignsTable from "@/components/admin/CampaignsTable";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminCampaigns } from "@/lib/supabase/admin";

export default async function AdminCampaignsPage() {
  const { supabase } = await requireAdmin();
  const campaigns = await getAdminCampaigns(supabase);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">行銷活動</h1>
          <p className="mt-1 text-sm text-slate-500">
            管理首頁橫幅及推廣活動
          </p>
        </div>
        <Link
          href="/admin/campaigns/new"
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
        >
          + 新增活動
        </Link>
      </div>

      <p className="text-sm text-slate-500">共 {campaigns.length} 個活動</p>
      <CampaignsTable campaigns={campaigns} />
    </div>
  );
}
