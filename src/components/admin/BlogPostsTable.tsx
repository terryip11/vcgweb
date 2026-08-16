"use client";

import Link from "next/link";
import type { BlogPost } from "@/types";
import { BLOG_CATEGORY_LABELS } from "@/data/blog-posts";

export default function BlogPostsTable({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center text-sm text-slate-500">
        尚未在資料庫建立文章。前台目前顯示內建 SEO 文章；新增後將以資料庫內容為準。
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">標題</th>
            <th className="px-4 py-3">分類</th>
            <th className="px-4 py-3">狀態</th>
            <th className="px-4 py-3">發佈</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.slug} className="border-t border-slate-100">
              <td className="px-4 py-3">
                <p className="font-semibold text-slate-900">{post.title}</p>
                <p className="text-xs text-slate-400">/blog/{post.slug}</p>
              </td>
              <td className="px-4 py-3 text-slate-600">
                {BLOG_CATEGORY_LABELS[post.category]}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    post.isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {post.isActive ? "已發佈" : "已下架"}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-600">
                {new Date(post.publishedAt).toLocaleDateString("zh-HK")}
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/blog/${post.slug}`}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  編輯
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
