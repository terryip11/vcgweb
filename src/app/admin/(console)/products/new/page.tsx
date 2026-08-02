import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/admin/auth";

export default async function AdminNewProductPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← 返回產品列表
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">新增產品</h1>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <ProductForm isNew />
      </div>
    </div>
  );
}
