import type { Metadata } from "next";
import CampaignBanner from "@/components/CampaignBanner";
import CategoryQuickLinks from "@/components/CategoryQuickLinks";
import CompareCta from "@/components/CompareCta";
import HeroSearch from "@/components/HeroSearch";
import PageShell from "@/components/layout/PageShell";
import TrustStats from "@/components/TrustStats";
import { getCampaigns } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "香港私人貸款及中小企融資比較平台",
  description:
    "VCG — 一站式比較私人貸款 APR、中小企八成信貸擔保、政府基金（ESS / BUD / EMF）及業主貸款，免費專人跟進。",
};

export default async function Home() {
  const campaigns = await getCampaigns();

  return (
    <PageShell>
      <HeroSearch />
      <CategoryQuickLinks />
      <CampaignBanner campaigns={campaigns} />
      <CompareCta />
      <TrustStats />
    </PageShell>
  );
}
