import type { Metadata } from "next";
import Link from "next/link";
import BlogCard from "@/components/blog/BlogCard";
import PageShell from "@/components/layout/PageShell";
import { buildBlogListJsonLd } from "@/lib/blog/json-ld";
import { getBlogPosts } from "@/lib/supabase/blog-queries";

export const metadata: Metadata = {
  title: "財經資訊 — 香港貸款指南",
  description:
    "VCG 財經資訊：香港私人貸款 APR 比較、中小企八成信貸擔保、稅季貸款及 DSR 供款比率等實用指南，助您了解借貸及融資。",
  keywords: [
    "香港貸款",
    "私人貸款指南",
    "中小企融資",
    "稅季貸款",
    "APR",
    "DSR",
    "VCG",
  ],
  alternates: {
    canonical: "/blog",
  },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const jsonLd = buildBlogListJsonLd(posts);

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="border-b border-slate-100 bg-gradient-to-b from-blue-50/80 to-white py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <nav className="mb-4 text-sm text-slate-500">
            <Link href="/" className="hover:text-blue-600">
              首頁
            </Link>
            <span className="mx-2">/</span>
            <span className="text-slate-700">財經資訊</span>
          </nav>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            財經資訊
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            香港私人貸款、中小企融資、稅季貸款及政府基金相關指南。內容僅供參考，不構成財務建議。
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>

          {posts.length === 0 && (
            <p className="py-12 text-center text-slate-500">暫無文章。</p>
          )}

          <div className="mt-12 rounded-2xl border border-blue-100 bg-blue-50 p-6 text-center sm:p-8">
            <h2 className="text-lg font-bold text-slate-900">需要個人化配對？</h2>
            <p className="mt-2 text-sm text-slate-600">
              VCG 提供免費貸款比較及專人跟進，24 小時內回覆。
            </p>
            <Link
              href="/compare"
              className="mt-4 inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700"
            >
              立即比較貸款
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
