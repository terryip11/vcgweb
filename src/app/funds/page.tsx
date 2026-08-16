import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import FundSection from "@/components/funds/FundSection";

export const metadata: Metadata = {
  title: "基金申請 | VCG",
  description:
    "VCG 協助香港企業申請政府資助計劃，包括 ESS 企業支援計劃、BUD 專項基金及 EMF 市場推廣基金，提供資格評估及申請策劃。",
};

export default function FundsPage() {
  return (
    <PageShell>
      <FundSection />
    </PageShell>
  );
}
