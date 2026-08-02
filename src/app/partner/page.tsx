import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import AffiliatePartnerSection from "@/components/partner/AffiliatePartnerSection";
import TrustStats from "@/components/TrustStats";

export const metadata: Metadata = {
  title: "推廣夥伴計劃 | 創健佳商業事務所 | VCG",
  description:
    "加入 VCG Affiliate 推廣夥伴計劃，分享貸款比較及政府基金資訊，透過專屬連結追蹤查詢並賺取佣金。",
};

export default function PartnerPage() {
  return (
    <PageShell>
      <AffiliatePartnerSection />
      <TrustStats />
    </PageShell>
  );
}
