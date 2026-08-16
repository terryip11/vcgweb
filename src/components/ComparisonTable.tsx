"use client";

import { useEffect, useMemo, useState } from "react";
import { trackAffiliateClick } from "@/lib/analytics/track-click";
import { productImageDisplayFromProduct } from "@/lib/product-image-display";
import type { LoanCategory, Product } from "@/types";
import LeadModal from "./LeadModal";
import ProductLogo from "./ProductLogo";

const WHATSAPP = "85264754756";

interface ComparisonTableProps {
  products: Product[];
  initialCategory?: LoanCategory | "all";
}

type SortKey = "apr" | "maxAmount" | "maxTermMonths";

const categoryLabels: Record<LoanCategory, string> = {
  personal: "私人貸款",
  sme: "中小企",
  owner: "業主貸款",
  tax: "稅季貸款",
  business: "小商務",
};

function formatAmount(n: number) {
  if (n >= 1000000) return `HK$${(n / 1000000).toFixed(1)}M`;
  return `HK$${n.toLocaleString()}`;
}

export default function ComparisonTable({
  products,
  initialCategory = "all",
}: ComparisonTableProps) {
  const [category, setCategory] = useState<LoanCategory | "all">(
    initialCategory,
  );
  const [sortBy, setSortBy] = useState<SortKey>("apr");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== "all") {
      list = list.filter((p) => p.category === category);
    }
    list.sort((a, b) => a[sortBy] - b[sortBy]);
    return list;
  }, [products, category, sortBy]);

  return (
    <>
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                私人及商業貸款比較
              </h2>
              <p className="mt-2 text-slate-500">
                按 APR 排序，比較利率、最高貸款額及還款期。實際以機構審批為準。
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(["all", "personal", "tax", "sme", "business"] as const).map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      category === cat
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat === "all" ? "全部" : categoryLabels[cat]}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="mb-4 flex items-center gap-3 text-sm">
            <span className="text-slate-500">排序：</span>
            {(
              [
                ["apr", "APR 最低"],
                ["maxAmount", "最高貸款額"],
                ["maxTermMonths", "最長還款期"],
              ] as [SortKey, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSortBy(key)}
                className={`rounded-lg px-3 py-1 text-xs font-medium ${
                  sortBy === key
                    ? "bg-slate-800 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filtered.map((product, index) => (
              <article
                key={product.id}
                className={`relative overflow-hidden rounded-2xl border transition hover:shadow-md ${
                  product.isFeatured
                    ? "border-amber-200 bg-amber-50/30"
                    : "border-slate-200 bg-white"
                }`}
              >
                {index === 0 && sortBy === "apr" && (
                  <div className="absolute right-0 top-0 rounded-bl-xl bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
                    最低 APR
                  </div>
                )}

                <div
                  className={`grid gap-4 p-5 sm:items-center sm:p-6 ${
                    product.imageUrl
                      ? "sm:grid-cols-[auto_1fr_auto]"
                      : "sm:grid-cols-[1fr_auto]"
                  }`}
                >
                  {product.imageUrl && (
                    <ProductLogo
                      src={product.imageUrl}
                      alt={product.name}
                      {...productImageDisplayFromProduct(product)}
                    />
                  )}
                  <div>
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900">
                        {product.name}
                      </h3>
                      {product.badges.map((badge) => (
                        <span
                          key={badge}
                          className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                    <p className="mb-3 text-sm text-slate-500">
                      {product.tagline}
                    </p>

                    <div className="mb-3 grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-xs text-slate-400">實際年利率</p>
                        <p className="text-xl font-bold text-blue-600">
                          {product.apr}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">最高貸款額</p>
                        <p className="text-sm font-semibold text-slate-800">
                          {formatAmount(product.maxAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">最長還款期</p>
                        <p className="text-sm font-semibold text-slate-800">
                          {product.maxTermMonths} 個月
                        </p>
                      </div>
                    </div>

                    <ul className="flex flex-wrap gap-x-4 gap-y-1">
                      {product.features.slice(0, 3).map((f) => (
                        <li
                          key={f}
                          className="text-xs text-slate-600 before:mr-1 before:text-emerald-500 before:content-['✓']"
                        >
                          {f}
                        </li>
                      ))}
                    </ul>

                    {product.exclusiveOffer && (
                      <p className="mt-3 inline-flex items-center gap-1 rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-800">
                        🎁 {product.exclusiveOffer}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 sm:min-w-[160px]">
                    <button
                      type="button"
                      onClick={() => {
                        trackAffiliateClick({
                          productId: product.id,
                          source: "comparison_apply",
                        });
                        setSelectedProduct(product);
                      }}
                      className="rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-amber-400"
                    >
                      立即申請
                    </button>
                    <a
                      href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`你好，我想查詢 ${product.name}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackAffiliateClick({
                          productId: product.id,
                          source: "comparison_whatsapp",
                        })
                      }
                      className="rounded-xl border border-slate-200 px-5 py-2.5 text-center text-sm font-medium text-slate-600 transition hover:border-emerald-400 hover:text-emerald-700"
                    >
                      WhatsApp 查詢
                    </a>
                  </div>
                </div>
              </article>
            ))}

            {filtered.length === 0 && (
              <p className="py-12 text-center text-slate-500">
                此類別暫無產品，請選擇其他類型或 WhatsApp 查詢。
              </p>
            )}
          </div>

          <p className="mt-6 text-xs text-slate-400">
            * 以上利率及條款僅供參考，實際以金融機構審批及官方條款為準。VCG
            為配對平台，不參與貸款審批。
          </p>
        </div>
      </section>

      {selectedProduct && (
        <LeadModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}
