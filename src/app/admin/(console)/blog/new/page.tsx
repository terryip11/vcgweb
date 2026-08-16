import Link from "next/link";
import BlogForm from "@/components/admin/BlogForm";

export default function AdminNewBlogPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/blog"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← 返回文章列表
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">新增文章</h1>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <BlogForm isNew />
      </div>
    </div>
  );
}
