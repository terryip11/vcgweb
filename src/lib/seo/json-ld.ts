import type { BlogFaqItem } from "@/types";
import { getSiteUrl } from "@/lib/site";

export function buildSiteJsonLd() {
  const url = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${url}/#organization`,
        name: "VCG",
        alternateName: "VCG 香港貸款配對平台",
        url,
        logo: `${url}/icon`,
        description:
          "VCG 是香港私人貸款及中小企融資配對平台，協助用戶比較 APR、申請政府基金及取得專人跟進。",
        areaServed: {
          "@type": "Country",
          name: "Hong Kong",
        },
        knowsAbout: [
          "私人貸款",
          "中小企融資",
          "稅季貸款",
          "業主貸款",
          "政府基金",
          "八成信貸擔保",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url,
        name: "VCG — 香港貸款配對平台",
        description:
          "比較香港私人貸款、中小企融資、政府基金申請及業主貸款。VCG 專人免費跟進。",
        inLanguage: "zh-HK",
        publisher: { "@id": `${url}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${url}/compare?category={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}

export function buildFaqPageJsonLd(faq: BlogFaqItem[], pageUrl: string) {
  if (!faq.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
    url: pageUrl,
    inLanguage: "zh-HK",
  };
}
