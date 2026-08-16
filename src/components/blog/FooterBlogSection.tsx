import Link from "next/link";
import BlogCard from "@/components/blog/BlogCard";
import { getBlogPosts } from "@/lib/supabase/blog-queries";

export default async function FooterBlogSection() {
  const posts = await getBlogPosts(3);
  if (!posts.length) return null;

  return (
    <section
      aria-labelledby="footer-blog-heading"
      className="border-t border-slate-100 bg-slate-50 py-12"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              財經資訊
            </p>
            <h2
              id="footer-blog-heading"
              className="mt-1 text-2xl font-bold text-slate-900"
            >
              貸款指南與常見問題
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              香港私人貸款、中小企融資及政府基金實用資訊，助您了解 APR、DSR
              及申請流程。
            </p>
          </div>
          <Link
            href="/blog"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
          >
            查看全部文章
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} compact />
          ))}
        </div>
      </div>
    </section>
  );
}
