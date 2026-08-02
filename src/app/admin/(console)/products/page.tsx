import Link from "next/link";
import ProductsTable from "@/components/admin/ProductsTable";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminProducts } from "@/lib/supabase/admin";

export default async function AdminProductsPage() {
  const { supabase } = await requireAdmin();
  const products = await getAdminProducts(supabase);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">貸款產品</h1>
          <p className="mt-1 text-sm text-slate-500">
            管理比較表及網站展示的貸款產品
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
        >
          + 新增產品
        </Link>
      </div>

      <p className="text-sm text-slate-500">共 {products.length} 個產品</p>
      <ProductsTable products={products} />
    </div>
  );
}
