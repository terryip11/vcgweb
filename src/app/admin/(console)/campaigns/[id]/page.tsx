import Link from "next/link";
import { notFound } from "next/navigation";
import CampaignForm from "@/components/admin/CampaignForm";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminCampaignById } from "@/lib/supabase/admin";

interface CampaignEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditCampaignPage({
  params,
}: CampaignEditPageProps) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  const campaign = await getAdminCampaignById(supabase, id);

  if (!campaign) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/campaigns"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← 返回活動列表
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">編輯活動</h1>
        <p className="mt-1 text-sm text-slate-500">{campaign.title}</p>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <CampaignForm campaign={campaign} />
      </div>
    </div>
  );
}
