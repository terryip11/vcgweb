import type { Metadata } from "next";
import BlogFaqSection from "@/components/blog/BlogFaqSection";
import PageShell from "@/components/layout/PageShell";
import SmeSection from "@/components/SmeSection";
import { smePageFaq } from "@/data/page-faqs";
import { buildFaqPageJsonLd } from "@/lib/seo/json-ld";
import { getSiteUrl } from "@/lib/site";
import { getProducts } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "政府中小企融資 | VCG",
  description:
    "VCG 協助中小企申請政府八成信貸擔保計劃及配對銀行中小企商業貸款，提供文件準備及申請跟進。",
  alternates: {
    canonical: "/sme",
  },
};

export default async function SmePage() {
  const products = await getProducts();
  const smeProducts = products.filter(
    (p) => p.category === "sme" || p.category === "business",
  );
  const pageUrl = `${getSiteUrl()}/sme`;
  const faqJsonLd = buildFaqPageJsonLd(smePageFaq, pageUrl);

  return (
    <PageShell>
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <SmeSection alternativeProducts={smeProducts} />

      <div className="mx-auto max-w-6xl px-4 pb-16">
        <BlogFaqSection faq={smePageFaq} />
      </div>
    </PageShell>
  );
}
