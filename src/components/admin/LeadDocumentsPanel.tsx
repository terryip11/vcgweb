"use client";

import { useEffect, useState } from "react";
import { MEDIA_CATEGORY_LABELS } from "@/lib/r2/config";
import type { MediaAsset } from "@/types";

export default function LeadDocumentsPanel({ leadId }: { leadId: string }) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAssets() {
    setLoading(true);
    const res = await fetch(`/api/admin/leads/${leadId}/media`);
    if (res.ok) {
      const data = (await res.json()) as { assets: MediaAsset[] };
      setAssets(data.assets);
    }
    setLoading(false);
  }

  useEffect(() => {
    void loadAssets();
  }, [leadId]);

  async function handleDelete(id: string) {
    if (!confirm("確定刪除此文件？")) return;
    const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
    if (res.ok) {
      setAssets((prev) => prev.filter((a) => a.id !== id));
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">載入附件中…</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-sm font-bold text-slate-900">附件（R2）</h2>

      {assets.length === 0 ? (
        <p className="text-sm text-slate-500">客戶尚未上傳文件</p>
      ) : (
        <ul className="space-y-3">
          {assets.map((asset) => (
            <li
              key={asset.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {MEDIA_CATEGORY_LABELS[asset.category] ?? asset.category}
                </p>
                <p className="text-xs text-slate-500">
                  {asset.originalName ?? asset.objectKey}
                  {" · "}
                  {(asset.sizeBytes / 1024).toFixed(0)} KB
                </p>
              </div>
              <div className="flex gap-2">
                {asset.url && (
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    查看
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => void handleDelete(asset.id)}
                  className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
                >
                  刪除
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
