import Link from "next/link";
import BlogPostsTable from "@/components/admin/BlogPostsTable";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminBlogPosts } from "@/lib/supabase/admin";

export default async function AdminBlogPage() {
  const { supabase } = await requireAdmin();
  const posts = await getAdminBlogPosts(supabase);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">財經資訊 / Blog</h1>
          <p className="mt-1 text-sm text-slate-500">
            管理 SEO 及 GEO 用文章，顯示於 /blog 及全站 Footer
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
        >
          + 新增文章
        </Link>
      </div>

      <p className="text-sm text-slate-500">共 {posts.length} 篇（資料庫）</p>
      <BlogPostsTable posts={posts} />
    </div>
  );
}
