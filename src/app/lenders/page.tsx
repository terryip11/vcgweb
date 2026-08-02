import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import LenderPartnerSection from "@/components/partner/LenderPartnerSection";
import TrustStats from "@/components/TrustStats";

export const metadata: Metadata = {
  title: "貸款機構合作 | 創健佳商業事務所 | VCG",
  description:
    "VCG 誠邀銀行及財務公司 B2B 合作，專注中小企貸款、私人貸款及物業按揭，穩定客源助您拓展業務。",
};

export default function LendersPage() {
  return (
    <PageShell>
      <PageHero
        badge="B2B 合作"
        title="貸款機構合作"
        subtitle="專注中小企貸款、私人貸款及物業按揭需求，客戶均經初步財務評估，降低壞賬風險。"
      />
      <LenderPartnerSection />
      <TrustStats />
      <div className="pb-12 text-center">
        <p className="text-sm text-slate-500">
          想成為推廣夥伴賺取佣金？請見{" "}
          <Link href="/partner" className="font-semibold text-teal-600 hover:underline">
            VCG 推廣夥伴計劃
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
