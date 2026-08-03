"use client";

import { useCallback, useEffect, useState } from "react";
import ImageUpload from "@/components/media/ImageUpload";
import { MEDIA_CATEGORY_LABELS } from "@/lib/r2/config";
import type { MediaAsset } from "@/types";

const LEAD_DOC_TYPES = [
  { category: "lead_br", label: "商業登記證" },
  { category: "lead_bank_statement", label: "銀行月結單" },
  { category: "lead_id", label: "身份證明" },
  { category: "lead_financial", label: "財務報表" },
  { category: "lead_other", label: "其他文件" },
] as const;

type CategoryUpload = {
  assetId?: string;
  fileName: string;
  mimeType: string;
  url?: string;
  localPreview?: string;
};

function isPdfMime(mimeType?: string) {
  return mimeType === "application/pdf";
}

function CategoryUploadCard({
  leadId,
  category,
  label,
  upload,
  onUploaded,
}: {
  leadId: string;
  category: string;
  label: string;
  upload?: CategoryUpload;
  onUploaded: (
    category: string,
    meta: {
      fileName: string;
      mimeType: string;
      url?: string;
      assetId?: string;
      localPreview?: string;
    },
  ) => void;
}) {
  const previewSrc = upload?.localPreview ?? upload?.url;
  const isPdf = upload ? isPdfMime(upload.mimeType) : false;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h4 className="text-sm font-bold text-slate-900">{label}</h4>
          <p className="mt-0.5 text-xs text-slate-500">
            {upload ? upload.fileName : "尚未上傳"}
          </p>
        </div>
        {upload ? (
          <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
            已上傳資料
          </span>
        ) : (
          <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
            待上傳
          </span>
        )}
      </div>

      {upload && (
        <div className="mb-3 overflow-hidden rounded-lg border border-emerald-100 bg-emerald-50/50">
          {previewSrc && !isPdf ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewSrc}
              alt={label}
              className="h-36 w-full object-contain bg-white"
            />
          ) : (
            <div className="flex h-24 items-center justify-center text-sm font-medium text-slate-600">
              PDF 文件已上傳
            </div>
          )}
        </div>
      )}

      <ImageUpload
        entityType="lead"
        entityId={leadId}
        category={category}
        accept="image/jpeg,image/png,image/webp,application/pdf"
        requireConfirm
        hidePreview
        onUploaded={(_url, meta) => {
          if (!meta) return;
          onUploaded(category, {
            fileName: meta.fileName,
            mimeType: meta.mimeType ?? "application/octet-stream",
            url: _url || undefined,
            assetId: meta.assetId,
            localPreview: meta.localPreview,
          });
        }}
      />
    </article>
  );
}

export default function LeadDocumentUpload({
  leadId,
  onUploaded,
}: {
  leadId: string;
  onUploaded?: () => void;
}) {
  const [uploadsByCategory, setUploadsByCategory] = useState<
    Record<string, CategoryUpload>
  >({});
  const [loading, setLoading] = useState(true);

  const mergeAssets = useCallback((assets: MediaAsset[]) => {
    setUploadsByCategory((prev) => {
      const next = { ...prev };

      for (const asset of assets) {
        if (!asset.category) continue;
        const existing = prev[asset.category];
        next[asset.category] = {
          assetId: asset.id,
          fileName: asset.originalName ?? existing?.fileName ?? "文件",
          mimeType: asset.mimeType,
          url: asset.url ?? existing?.url,
          localPreview: existing?.localPreview,
        };
      }

      return next;
    });
  }, []);

  const loadAssets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leads/${leadId}/media`);
      if (res.ok) {
        const data = (await res.json()) as { assets: MediaAsset[] };
        mergeAssets(data.assets ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, [leadId, mergeAssets]);

  useEffect(() => {
    void loadAssets();
  }, [loadAssets]);

  function handleUploaded(
    category: string,
    meta: {
      fileName: string;
      mimeType: string;
      url?: string;
      assetId?: string;
      localPreview?: string;
    },
  ) {
    setUploadsByCategory((prev) => ({
      ...prev,
      [category]: {
        assetId: meta.assetId ?? prev[category]?.assetId,
        fileName: meta.fileName,
        mimeType: meta.mimeType,
        url: meta.url ?? prev[category]?.url,
        localPreview: meta.localPreview ?? prev[category]?.localPreview,
      },
    }));

    onUploaded?.();

    window.setTimeout(() => {
      void loadAssets();
    }, 500);
  }

  const uploadedCount = LEAD_DOC_TYPES.filter(
    (t) => uploadsByCategory[t.category],
  ).length;

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="mb-1 text-sm font-semibold text-slate-900">
        上傳相關文件（可選）
      </p>
      <p className="mb-4 text-xs text-slate-500">
        支援 JPG、PNG、PDF，單檔最大 5MB · 每類文件獨立上傳 ·
        選擇檔案後需按「確認上傳」
        {uploadedCount > 0 && ` · 已完成 ${uploadedCount}/${LEAD_DOC_TYPES.length} 類`}
      </p>

      {loading && uploadedCount === 0 && (
        <p className="mb-4 text-xs text-slate-400">載入上傳狀態…</p>
      )}

      <div className="space-y-4">
        {LEAD_DOC_TYPES.map((type) => (
          <CategoryUploadCard
            key={type.category}
            leadId={leadId}
            category={type.category}
            label={type.label}
            upload={uploadsByCategory[type.category]}
            onUploaded={handleUploaded}
          />
        ))}
      </div>
    </div>
  );
}
