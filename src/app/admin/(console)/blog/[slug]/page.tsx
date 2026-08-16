import Link from "next/link";
import { notFound } from "next/navigation";
import BlogForm from "@/components/admin/BlogForm";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminBlogPostBySlug } from "@/lib/supabase/admin";

interface AdminEditBlogPageProps {
  params: Promise<{ slug: string }>;
}

export default async function AdminEditBlogPage({
  params,
}: AdminEditBlogPageProps) {
  const { supabase } = await requireAdmin();
  const { slug } = await params;
  const post = await getAdminBlogPostBySlug(supabase, slug);

  if (!post) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/blog"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← 返回文章列表
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">編輯文章</h1>
        <p className="mt-1 text-sm text-slate-500">{post.title}</p>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <BlogForm post={post} />
      </div>
    </div>
  );
}
