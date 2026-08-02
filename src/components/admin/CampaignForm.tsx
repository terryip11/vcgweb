"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ImageUpload from "@/components/media/ImageUpload";
import type { Campaign } from "@/types";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

export default function CampaignForm({
  campaign,
  isNew = false,
}: {
  campaign?: Campaign;
  isNew?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [id, setId] = useState(campaign?.id ?? "");
  const [title, setTitle] = useState(campaign?.title ?? "");
  const [subtitle, setSubtitle] = useState(campaign?.subtitle ?? "");
  const [ctaText, setCtaText] = useState(campaign?.ctaText ?? "立即申請");
  const [ctaHref, setCtaHref] = useState(campaign?.ctaHref ?? "/compare");
  const [badge, setBadge] = useState(campaign?.badge ?? "");
  const [expiresAt, setExpiresAt] = useState(campaign?.expiresAt ?? "");
  const [imageUrl, setImageUrl] = useState(campaign?.imageUrl ?? "");
  const [isActive, setIsActive] = useState(campaign?.isActive !== false);
  const [sortOrder, setSortOrder] = useState(String(campaign?.sortOrder ?? 0));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      id: id.trim(),
      title: title.trim(),
      subtitle: subtitle.trim(),
      ctaText: ctaText.trim(),
      ctaHref: ctaHref.trim(),
      badge: badge.trim() || null,
      expiresAt: expiresAt || null,
      imageUrl: imageUrl.trim() || null,
      isActive,
      sortOrder: Number(sortOrder),
    };

    try {
      const url = isNew ? "/api/admin/campaigns" : `/api/admin/campaigns/${id}`;
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

      router.push("/admin/campaigns");
      router.refresh();
    } catch {
      setError("網絡錯誤，請重試");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeactivate() {
    if (!campaign || !confirm("確定要下架此活動？")) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/campaigns/${campaign.id}`, {
        method: "DELETE",
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "下架失敗");
        return;
      }
      router.push("/admin/campaigns");
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
            活動 ID {isNew && "*"}
          </label>
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            disabled={!isNew}
            placeholder="tax-season-2026"
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
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            標題 *
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            副標題
          </label>
          <textarea
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={3}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            CTA 按鈕文字
          </label>
          <input
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            CTA 連結
          </label>
          <input
            value={ctaHref}
            onChange={(e) => setCtaHref(e.target.value)}
            placeholder="/compare"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            標籤
          </label>
          <input
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
            placeholder="限時"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            到期日
          </label>
          <input
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <ImageUpload
        entityType="campaign"
        entityId={id}
        category="campaign_banner"
        label="橫幅圖片（R2）"
        currentUrl={imageUrl}
        onUploaded={setImageUrl}
        disabled={!id.trim()}
      />

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="rounded border-slate-300"
        />
        上架顯示
      </label>

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
          {loading ? "儲存中…" : "儲存活動"}
        </button>
        {!isNew && campaign && (
          <button
            type="button"
            onClick={handleDeactivate}
            disabled={loading}
            className="rounded-xl border border-red-200 px-6 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
          >
            下架活動
          </button>
        )}
      </div>
    </form>
  );
}
