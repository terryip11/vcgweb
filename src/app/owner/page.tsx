import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import OwnerLoanSection from "@/components/OwnerLoanSection";

export const metadata: Metadata = {
  title: "業主貸款 | 創健佳商業事務所 | VCG",
  description:
    "VCG 業主貸款配對 — 免抵押、毋須田土廳登記，業主與企業貸款靈活配對，最高達物業估值 80%。",
};

export default function OwnerPage() {
  return (
    <PageShell>
      <PageHero
        badge="VCG 獨家"
        title="業主 + 企業聯動貸款"
        subtitle="免抵押業主貸款，配合企業現金流需求靈活配對，毋須在土地註冊處登記。"
      />
      <OwnerLoanSection />
    </PageShell>
  );
}
