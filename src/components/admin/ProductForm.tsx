"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ImageUpload from "@/components/media/ImageUpload";
import {
  arrayToLines,
  LOAN_CATEGORIES,
  LOAN_CATEGORY_LABELS,
  linesToArray,
} from "@/lib/admin/constants";
import type { LoanCategory, Product } from "@/types";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

export default function ProductForm({
  product,
  isNew = false,
}: {
  product?: Product;
  isNew?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [id, setId] = useState(product?.id ?? "");
  const [name, setName] = useState(product?.name ?? "");
  const [provider, setProvider] = useState(product?.provider ?? "");
  const [category, setCategory] = useState<LoanCategory>(
    product?.category ?? "personal",
  );
  const [tagline, setTagline] = useState(product?.tagline ?? "");
  const [apr, setApr] = useState(String(product?.apr ?? ""));
  const [monthlyFlat, setMonthlyFlat] = useState(
    product?.monthlyFlat != null ? String(product.monthlyFlat) : "",
  );
  const [maxAmount, setMaxAmount] = useState(String(product?.maxAmount ?? ""));
  const [maxTermMonths, setMaxTermMonths] = useState(
    String(product?.maxTermMonths ?? ""),
  );
  const [features, setFeatures] = useState(arrayToLines(product?.features ?? []));
  const [badges, setBadges] = useState(arrayToLines(product?.badges ?? []));
  const [exclusiveOffer, setExclusiveOffer] = useState(
    product?.exclusiveOffer ?? "",
  );
  const [applyUrl, setApplyUrl] = useState(product?.applyUrl ?? "");
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
  const [isActive, setIsActive] = useState(product?.isActive !== false);
  const [sortOrder, setSortOrder] = useState(String(product?.sortOrder ?? 0));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      id: id.trim(),
      name: name.trim(),
      provider: provider.trim(),
      category,
      tagline: tagline.trim(),
      apr: Number(apr),
      monthlyFlat: monthlyFlat ? Number(monthlyFlat) : null,
      maxAmount: Number(maxAmount),
      maxTermMonths: Number(maxTermMonths),
      features: linesToArray(features),
      badges: linesToArray(badges),
      exclusiveOffer: exclusiveOffer.trim() || null,
      applyUrl: applyUrl.trim() || null,
      imageUrl: imageUrl.trim() || null,
      isFeatured,
      isActive,
      sortOrder: Number(sortOrder),
    };

    try {
      const url = isNew ? "/api/admin/products" : `/api/admin/products/${id}`;
      const method = isNew ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "儲存失敗");
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("網絡錯誤，請重試");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeactivate() {
    if (!product || !confirm("確定要下架此產品？")) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "下架失敗");
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("網絡錯誤，請重試");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            產品 ID {isNew && "*"}
          </label>
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            disabled={!isNew}
            placeholder="welend-tax"
            required
            className={`${inputClass} disabled:bg-slate-50 disabled:text-slate-500`}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            排序
          </label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            產品名稱 *
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            機構名稱 *
          </label>
          <input
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            類別 *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as LoanCategory)}
            className={inputClass}
          >
            {LOAN_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {LOAN_CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            標語
          </label>
          <input
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            APR (%) *
          </label>
          <input
            type="number"
            step="0.01"
            value={apr}
            onChange={(e) => setApr(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            月平息 (%)
          </label>
          <input
            type="number"
            step="0.01"
            value={monthlyFlat}
            onChange={(e) => setMonthlyFlat(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            最高額度 (HK$) *
          </label>
          <input
            type="number"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            最長期數 (月) *
          </label>
          <input
            type="number"
            value={maxTermMonths}
            onChange={(e) => setMaxTermMonths(e.target.value)}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-500">
          特色（每行一項）
        </label>
        <textarea
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          rows={4}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-500">
          標籤（每行一項）
        </label>
        <textarea
          value={badges}
          onChange={(e) => setBadges(e.target.value)}
          rows={3}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            VCG 專享優惠
          </label>
          <input
            value={exclusiveOffer}
            onChange={(e) => setExclusiveOffer(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            申請連結
          </label>
          <input
            value={applyUrl}
            onChange={(e) => setApplyUrl(e.target.value)}
            placeholder="https://"
            className={inputClass}
          />
        </div>
      </div>

      <ImageUpload
        entityType="product"
        entityId={id}
        category="product_image"
        label="產品圖片（R2）"
        currentUrl={imageUrl}
        onUploaded={setImageUrl}
        disabled={!id.trim()}
      />

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="rounded border-slate-300"
          />
          精選產品
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="rounded border-slate-300"
          />
          上架顯示
        </label>
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "儲存中…" : "儲存產品"}
        </button>
        {!isNew && product && (
          <button
            type="button"
            onClick={handleDeactivate}
            disabled={loading}
            className="rounded-xl border border-red-200 px-6 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
          >
            下架產品
          </button>
        )}
      </div>
    </form>
  );
}
