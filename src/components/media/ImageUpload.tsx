"use client";

import { useRef, useState } from "react";
import { MEDIA_CATEGORY_LABELS } from "@/lib/r2/config";
import type { MediaEntityType } from "@/types";

interface ImageUploadProps {
  entityType: MediaEntityType;
  entityId: string;
  category: string;
  label?: string;
  accept?: string;
  currentUrl?: string;
  onUploaded?: (url: string) => void;
  disabled?: boolean;
}

export default function ImageUpload({
  entityType,
  entityId,
  category,
  label,
  accept = "image/jpeg,image/png,image/webp,image/gif,application/pdf",
  currentUrl,
  onUploaded,
  disabled = false,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl ?? "");
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    if (!entityId) {
      setError("請先儲存並取得 ID");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const presignRes = await fetch("/api/media/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityType,
          entityId,
          category,
          fileName: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
        }),
      });

      const presignData = (await presignRes.json()) as {
        error?: string;
        uploadUrl?: string;
        assetId?: string;
        objectKey?: string;
        isPublic?: boolean;
      };

      if (!presignRes.ok || !presignData.uploadUrl) {
        setError(presignData.error ?? "無法上傳");
        return;
      }

      const uploadRes = await fetch(presignData.uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadRes.ok) {
        setError(`上傳至 R2 失敗（${uploadRes.status}）`);
        return;
      }

      const confirmRes = await fetch("/api/media/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: presignData.assetId,
          objectKey: presignData.objectKey,
          entityType,
          entityId,
          category,
          originalName: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
          isPublic: presignData.isPublic,
        }),
      });

      const confirmData = (await confirmRes.json()) as {
        error?: string;
        url?: string;
      };

      if (!confirmRes.ok) {
        setError(confirmData.error ?? "確認上傳失敗");
        return;
      }

      if (confirmData.url) {
        setPreview(confirmData.url);
        onUploaded?.(confirmData.url);
      } else if (presignData.assetId) {
        const viewRes = await fetch(`/api/media/${presignData.assetId}`);
        const viewData = (await viewRes.json()) as { url?: string };
        if (viewData.url) {
          setPreview(viewData.url);
          onUploaded?.(viewData.url);
        }
      }
    } catch (err) {
      console.error("ImageUpload failed:", err);
      setError(
        err instanceof TypeError
          ? "無法連接儲存服務（可能是 CORS 設定問題，請聯絡管理員）"
          : "網絡錯誤，請重試",
      );
    } finally {
      setUploading(false);
    }
  }

  const categoryLabel = MEDIA_CATEGORY_LABELS[category] ?? category;
  const isPdf = preview.endsWith(".pdf") || preview.includes("pdf");

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-xs font-semibold text-slate-500">
          {label}
        </label>
      )}

      {preview && !isPdf && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt={categoryLabel}
          className="h-32 w-full rounded-xl border border-slate-200 object-cover"
        />
      )}

      {preview && isPdf && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          PDF 已上傳
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        disabled={disabled || uploading || !entityId}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />

      <button
        type="button"
        disabled={disabled || uploading || !entityId}
        onClick={() => inputRef.current?.click()}
        className="rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-600 transition hover:border-blue-400 hover:text-blue-600 disabled:opacity-50"
      >
        {uploading
          ? "上傳中…"
          : preview
            ? `更換${categoryLabel}`
            : `上傳${categoryLabel}`}
      </button>

      {!entityId && (
        <p className="text-xs text-amber-600">請先儲存項目後再上傳圖片</p>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
