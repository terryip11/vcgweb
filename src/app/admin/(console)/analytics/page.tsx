import ClickStatsPanel from "@/components/admin/ClickStatsPanel";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminClickStats } from "@/lib/supabase/admin";

export default async function AdminAnalyticsPage() {
  const { supabase } = await requireAdmin();
  const stats = await getAdminClickStats(supabase);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">點擊分析</h1>
        <p className="mt-1 text-sm text-slate-500">
          追蹤用戶點擊「立即申請」及活動橫幅 CTA 的數據
        </p>
      </div>

      <ClickStatsPanel stats={stats} />
    </div>
  );
}
