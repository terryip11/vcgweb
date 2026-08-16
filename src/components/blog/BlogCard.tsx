import Link from "next/link";
import { BLOG_CATEGORY_LABELS } from "@/data/blog-posts";
import type { BlogPost } from "@/types";

export default function BlogCard({
  post,
  compact = false,
}: {
  post: BlogPost;
  compact?: boolean;
}) {
  const date = new Date(post.publishedAt).toLocaleDateString("zh-HK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article
      className={`group rounded-2xl border border-slate-200 bg-white transition hover:border-blue-200 hover:shadow-md ${
        compact ? "p-4" : "p-6"
      }`}
    >
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-medium text-blue-700">
          {BLOG_CATEGORY_LABELS[post.category]}
        </span>
        <time dateTime={post.publishedAt} className="text-slate-400">
          {date}
        </time>
        <span className="text-slate-400">· {post.readingMinutes} 分鐘閱讀</span>
      </div>

      <h2 className={`font-bold text-slate-900 group-hover:text-blue-700 ${compact ? "text-base" : "text-lg"}`}>
        <Link href={`/blog/${post.slug}`} className="hover:underline">
          {post.title}
        </Link>
      </h2>

      {!compact && (
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
          {post.excerpt}
        </p>
      )}

      <Link
        href={`/blog/${post.slug}`}
        className="mt-3 inline-flex text-sm font-semibold text-blue-600 hover:underline"
      >
        閱讀全文 →
      </Link>
    </article>
  );
}
