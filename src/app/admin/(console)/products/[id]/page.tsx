import Link from "next/link";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminProductById } from "@/lib/supabase/admin";

interface ProductEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditProductPage({
  params,
}: ProductEditPageProps) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  const product = await getAdminProductById(supabase, id);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← 返回產品列表
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">編輯產品</h1>
        <p className="mt-1 text-sm text-slate-500">{product.name}</p>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
