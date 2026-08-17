import type { Metadata } from "next";
import BlogFaqSection from "@/components/blog/BlogFaqSection";
import ComparisonTable from "@/components/ComparisonTable";
import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import { comparePageFaq } from "@/data/page-faqs";
import { buildFaqPageJsonLd } from "@/lib/seo/json-ld";
import { getSiteUrl } from "@/lib/site";
import { getProducts } from "@/lib/supabase/queries";
import type { LoanCategory } from "@/types";

export const metadata: Metadata = {
  title: "私人及商業貸款比較 | VCG",
  description:
    "比較香港私人貸款、稅季貸款、中小企及小商務貸款 APR、最高貸款額及還款期。VCG 獨家配對及專人跟進。",
  alternates: {
    canonical: "/compare",
  },
};

const validCategories = new Set([
  "personal",
  "sme",
  "owner",
  "tax",
  "business",
]);

function parseCategory(value?: string): LoanCategory | "all" {
  if (!value || !validCategories.has(value)) return "all";
  return value as LoanCategory;
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const products = await getProducts();
  const initialCategory = parseCategory(params.category);
  const pageUrl = `${getSiteUrl()}/compare`;
  const faqJsonLd = buildFaqPageJsonLd(comparePageFaq, pageUrl);

  return (
    <PageShell>
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <PageHero
        badge="貸款比較"
        title="私人及商業貸款比較"
        subtitle="按 APR 排序，比較利率、最高貸款額及還款期。經 VCG 申請享獨家配對及專人跟進。"
      />
      <ComparisonTable products={products} initialCategory={initialCategory} />

      <div className="mx-auto max-w-6xl px-4 pb-16">
        <BlogFaqSection faq={comparePageFaq} />
      </div>
    </PageShell>
  );
}
