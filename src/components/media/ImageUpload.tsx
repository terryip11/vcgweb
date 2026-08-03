"use client";

import { useEffect, useRef, useState } from "react";
import { MEDIA_CATEGORY_LABELS } from "@/lib/r2/config";
import type { MediaEntityType } from "@/types";

interface ImageUploadProps {
  entityType: MediaEntityType;
  entityId: string;
  category: string;
  label?: string;
  accept?: string;
  currentUrl?: string;
  onUploaded?: (
    url: string,
    meta?: {
      fileName: string;
      assetId?: string;
      mimeType?: string;
      localPreview?: string;
      category?: string;
    },
  ) => void;
  disabled?: boolean;
  requireConfirm?: boolean;
  /** 由父層顯示預覽時隱藏內建縮圖 */
  hidePreview?: boolean;
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
  requireConfirm = false,
  hidePreview = false,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    setPreview(currentUrl ?? "");
    setPendingFile(null);
    setPendingPreview("");
    setUploadSuccess(false);
    setError(null);
  }, [currentUrl, category]);

  useEffect(() => {
    return () => {
      if (pendingPreview.startsWith("blob:")) {
        URL.revokeObjectURL(pendingPreview);
      }
    };
  }, [pendingPreview]);

  async function handleFile(file: File) {
    if (!entityId) {
      setError("請先儲存並取得 ID");
      return;
    }

    const uploadCategory = category;

    setUploading(true);
    setError(null);
    setUploadSuccess(false);

    try {
      const presignRes = await fetch("/api/media/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityType,
          entityId,
          category: uploadCategory,
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
          category: uploadCategory,
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

      let uploadedUrl = confirmData.url;

      if (!uploadedUrl && presignData.assetId) {
        const viewRes = await fetch(`/api/media/${presignData.assetId}`);
        if (viewRes.ok) {
          const viewData = (await viewRes.json()) as { url?: string };
          uploadedUrl = viewData.url;
        }
      }

      const localPreview =
        file.type !== "application/pdf" ? URL.createObjectURL(file) : undefined;

      if (presignData.assetId) {
        setPreview(localPreview ?? uploadedUrl ?? "");
        setPendingFile(null);
        if (pendingPreview.startsWith("blob:")) {
          URL.revokeObjectURL(pendingPreview);
        }
        setPendingPreview("");
        setUploadSuccess(true);
        onUploaded?.(uploadedUrl ?? "", {
          fileName: file.name,
          assetId: presignData.assetId,
          mimeType: file.type,
          localPreview,
          category: uploadCategory,
        });
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

  function handleFileSelect(file: File) {
    setError(null);
    setUploadSuccess(false);

    if (requireConfirm) {
      if (pendingPreview.startsWith("blob:")) {
        URL.revokeObjectURL(pendingPreview);
      }
      const objectUrl =
        file.type === "application/pdf" ? "" : URL.createObjectURL(file);
      setPendingFile(file);
      setPendingPreview(objectUrl);
      return;
    }

    void handleFile(file);
  }

  function cancelPending() {
    setPendingFile(null);
    if (pendingPreview.startsWith("blob:")) {
      URL.revokeObjectURL(pendingPreview);
    }
    setPendingPreview("");
    setError(null);
  }

  const categoryLabel = MEDIA_CATEGORY_LABELS[category] ?? category;
  const displayPreview = pendingFile ? pendingPreview : preview;
  const isPdf =
    pendingFile?.type === "application/pdf" ||
    preview.endsWith(".pdf") ||
    preview.includes("pdf");

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-xs font-semibold text-slate-500">
          {label}
        </label>
      )}

      {!hidePreview && displayPreview && !isPdf && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={displayPreview}
          alt={categoryLabel}
          className="h-32 w-full rounded-xl border border-slate-200 object-cover"
        />
      )}

      {!hidePreview && isPdf && (preview || pendingFile) && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          PDF{pendingFile ? `：${pendingFile.name}` : " 已上傳"}
        </div>
      )}

      {pendingFile && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          {pendingPreview && pendingFile.type !== "application/pdf" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={pendingPreview}
              alt="待確認預覽"
              className="mb-3 h-32 w-full rounded-lg border border-amber-100 bg-white object-contain"
            />
          )}
          <p className="text-sm font-medium text-amber-900">
            確認上傳「{categoryLabel}」？
          </p>
          <p className="mt-1 text-xs text-amber-800">{pendingFile.name}</p>
          <p className="mt-2 text-xs text-amber-700">
            請確認檔案無誤後才上傳
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              disabled={uploading}
              onClick={() => void handleFile(pendingFile)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {uploading ? "上傳中…" : "確認上傳"}
            </button>
            <button
              type="button"
              disabled={uploading}
              onClick={cancelPending}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {!pendingFile && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            disabled={disabled || uploading || !entityId}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
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
        </>
      )}

      {uploadSuccess && !pendingFile && (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700"
        >
          ✓ {categoryLabel} — 已上傳資料
        </div>
      )}

      {!entityId && (
        <p className="text-xs text-amber-600">請先儲存項目後再上傳圖片</p>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
