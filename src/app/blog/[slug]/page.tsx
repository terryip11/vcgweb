import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogFaqSection from "@/components/blog/BlogFaqSection";
import PageShell from "@/components/layout/PageShell";
import { BLOG_CATEGORY_LABELS } from "@/data/blog-posts";
import { buildBlogArticleJsonLd } from "@/lib/blog/json-ld";
import { parseBlogBody } from "@/lib/blog/render-body";
import {
  getBlogPostBySlug,
  getStaticBlogSlugs,
} from "@/lib/supabase/blog-queries";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getStaticBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "找不到文章" };

  return {
    title: post.title,
    description: post.metaDescription || post.excerpt,
    keywords: post.keywords,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      locale: "zh_HK",
      title: post.title,
      description: post.metaDescription || post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = buildBlogArticleJsonLd(post);
  const published = new Date(post.publishedAt).toLocaleDateString("zh-HK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const updated = post.updatedAt
    ? new Date(post.updatedAt).toLocaleDateString("zh-HK", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <nav className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-blue-600">
            首頁
          </Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-blue-600">
            財經資訊
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-700">{post.title}</span>
        </nav>

        <header>
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-medium text-blue-700">
              {BLOG_CATEGORY_LABELS[post.category]}
            </span>
            <time dateTime={post.publishedAt} className="text-slate-400">
              發佈：{published}
            </time>
            {updated && (
              <span className="text-slate-400">· 更新：{updated}</span>
            )}
            <span className="text-slate-400">
              · {post.readingMinutes} 分鐘閱讀
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            {post.excerpt}
          </p>
        </header>

        <div className="prose-blog mt-10">{parseBlogBody(post.body)}</div>

        <BlogFaqSection faq={post.faq} />

        <footer className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm text-slate-600">
            以上內容僅供一般參考，不構成財務建議。實際利率、批核條件及優惠以各金融機構及政府計劃最新公布為準。
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/compare"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
            >
              比較私人貸款
            </Link>
            <Link
              href="/blog"
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-300"
            >
              ← 返回財經資訊
            </Link>
          </div>
        </footer>
      </article>
    </PageShell>
  );
}
