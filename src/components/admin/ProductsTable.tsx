"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatHKD, LOAN_CATEGORY_LABELS } from "@/lib/admin/constants";
import type { Product } from "@/types";

function ProductActions({ product }: { product: Product }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDeactivate() {
    if (
      !window.confirm(
        `確定下架「${product.name}」？產品將不再於網站顯示，可稍後重新編輯上架。`,
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        window.alert(data.error ?? "下架失敗");
        return;
      }
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={`/admin/products/${product.id}`}
        className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
      >
        編輯
      </Link>
      {product.isActive !== false && (
        <button
          type="button"
          disabled={deleting}
          onClick={() => void handleDeactivate()}
          className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-60"
        >
          {deleting ? "下架中…" : "下架"}
        </button>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-slate-900">{product.name}</p>
          <p className="text-xs text-slate-500">{product.provider}</p>
          <p className="text-xs text-slate-400">{product.id}</p>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            product.isActive !== false
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {product.isActive !== false ? "上架" : "下架"}
        </span>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
        <div>
          <dt className="text-slate-400">類別</dt>
          <dd className="font-medium">{LOAN_CATEGORY_LABELS[product.category]}</dd>
        </div>
        <div>
          <dt className="text-slate-400">APR</dt>
          <dd className="font-medium">{product.apr}%</dd>
        </div>
        <div>
          <dt className="text-slate-400">最高額度</dt>
          <dd className="font-medium">{formatHKD(product.maxAmount)}</dd>
        </div>
        <div>
          <dt className="text-slate-400">排序</dt>
          <dd className="font-medium">{product.sortOrder}</dd>
        </div>
      </dl>
      <div className="mt-3">
        <ProductActions product={product} />
      </div>
    </article>
  );
}

export default function ProductsTable({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white px-6 py-16 text-center shadow-sm">
        <p className="text-sm text-slate-500">暫無產品</p>
        <Link
          href="/admin/products/new"
          className="mt-4 inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
        >
          新增產品
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 lg:hidden">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">產品</th>
                <th className="px-4 py-3">類別</th>
                <th className="px-4 py-3">APR</th>
                <th className="px-4 py-3">最高額度</th>
                <th className="px-4 py-3">狀態</th>
                <th className="px-4 py-3">排序</th>
                <th className="px-4 py-3">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{product.name}</p>
                    <p className="text-xs text-slate-500">{product.provider}</p>
                    <p className="text-xs text-slate-400">{product.id}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {LOAN_CATEGORY_LABELS[product.category]}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{product.apr}%</td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatHKD(product.maxAmount)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          product.isActive !== false
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {product.isActive !== false ? "上架" : "下架"}
                      </span>
                      {product.isFeatured && (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                          精選
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{product.sortOrder}</td>
                  <td className="px-4 py-3">
                    <ProductActions product={product} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
