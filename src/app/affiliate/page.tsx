import type { Metadata } from "next";
import Link from "next/link";
import AffiliateCommissionPlanInfo from "@/components/affiliate/AffiliateCommissionPlanInfo";
import AffiliateStatsOverview from "@/components/affiliate/AffiliateStatsOverview";
import ReferralToolkit from "@/components/affiliate/ReferralToolkit";
import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import { requireAffiliatePartner } from "@/lib/affiliate/auth";
import {
  getAffiliateCommissions,
  getAffiliateDashboardStats,
} from "@/lib/supabase/affiliate";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "推廣夥伴後台 | VCG",
  description: "VCG 推廣夥伴自助後台 — 查看點擊、查詢及佣金，管理專屬推廣連結。",
};

export default async function AffiliateDashboardPage() {
  const { partner } = await requireAffiliatePartner();
  const code = partner.referralCode!;

  const [stats, commissions] = await Promise.all([
    getAffiliateDashboardStats(code, partner),
    getAffiliateCommissions(partner.id),
  ]);

  const siteOrigin = getSiteUrl();
  const whatsappText = encodeURIComponent(
    `你好，我是 VCG 推廣夥伴，代碼 ${code}，想查詢佣金或推廣安排`,
  );

  return (
    <PageShell>
      <PageHero
        badge="Affiliate 後台"
        title={`你好，${partner.name}`}
        subtitle={`推廣代碼 ${code} · 僅統計香港 IP 的點擊及查詢`}
      />

      <section className="py-10">
        <div className="mx-auto max-w-6xl space-y-8 px-4">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/member"
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:border-teal-300 hover:text-teal-600"
            >
              會員中心
            </Link>
            <a
              href={`https://wa.me/85264754756?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700"
            >
              WhatsApp 聯絡 VCG
            </a>
          </div>

          <AffiliateCommissionPlanInfo />
          <AffiliateStatsOverview stats={stats} commissions={commissions} />
          <ReferralToolkit referralCode={code} siteOrigin={siteOrigin} />
        </div>
      </section>
    </PageShell>
  );
}
