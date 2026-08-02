import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import SmeSection from "@/components/SmeSection";
import { getProducts } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "政府中小企融資 | 創健佳商業事務所 | VCG",
  description:
    "VCG 協助中小企申請政府八成信貸擔保計劃及配對銀行中小企商業貸款，提供文件準備及申請跟進。",
};

export default async function SmePage() {
  const products = await getProducts();
  const smeProducts = products.filter(
    (p) => p.category === "sme" || p.category === "business",
  );

  return (
    <PageShell>
      <SmeSection alternativeProducts={smeProducts} />
    </PageShell>
  );
}
