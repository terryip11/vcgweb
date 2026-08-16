import type { BlogPost } from "@/types";
import { getSiteUrl } from "@/lib/site";

export function buildBlogArticleJsonLd(post: BlogPost) {
  const url = `${getSiteUrl()}/blog/${post.slug}`;
  const published = post.publishedAt;
  const modified = post.updatedAt ?? post.publishedAt;

  const graph: Record<string, unknown>[] = [
    {
      "@type": "Article",
      headline: post.title,
      description: post.metaDescription || post.excerpt,
      datePublished: published,
      dateModified: modified,
      author: {
        "@type": "Organization",
        name: "VCG",
        url: getSiteUrl(),
      },
      publisher: {
        "@type": "Organization",
        name: "VCG",
        url: getSiteUrl(),
      },
      mainEntityOfPage: url,
      keywords: post.keywords.join(", "),
      inLanguage: "zh-HK",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "首頁",
          item: getSiteUrl(),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "財經資訊",
          item: `${getSiteUrl()}/blog`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: post.title,
          item: url,
        },
      ],
    },
  ];

  if (post.faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: post.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export function buildBlogListJsonLd(posts: BlogPost[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "VCG 財經資訊",
    description:
      "香港私人貸款、中小企融資、稅季貸款及政府基金相關指南與常見問題。",
    url: `${getSiteUrl()}/blog`,
    inLanguage: "zh-HK",
    hasPart: posts.map((post) => ({
      "@type": "Article",
      headline: post.title,
      url: `${getSiteUrl()}/blog/${post.slug}`,
      datePublished: post.publishedAt,
    })),
  };
}
