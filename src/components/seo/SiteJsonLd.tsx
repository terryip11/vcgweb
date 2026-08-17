import { buildSiteJsonLd } from "@/lib/seo/json-ld";

export default function SiteJsonLd() {
  const jsonLd = buildSiteJsonLd();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
