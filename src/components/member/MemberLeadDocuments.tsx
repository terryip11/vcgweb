"use client";

import { useEffect, useState } from "react";
import LeadDocumentUpload from "@/components/media/LeadDocumentUpload";
import { MEDIA_CATEGORY_LABELS } from "@/lib/r2/config";
import type { MediaAsset } from "@/types";

export default function MemberLeadDocuments({ leadId }: { leadId: string }) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAssets() {
    setLoading(true);
    const res = await fetch(`/api/member/leads/${leadId}/media`);
    if (res.ok) {
      const data = (await res.json()) as { assets: MediaAsset[] };
      setAssets(data.assets);
    }
    setLoading(false);
  }

  useEffect(() => {
    void loadAssets();
  }, [leadId]);

  return (
    <div className="space-y-6">
      <LeadDocumentUpload leadId={leadId} onUploaded={() => void loadAssets()} />

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-sm font-bold text-slate-900">已上傳文件</h2>
        <p className="mb-4 text-xs text-slate-500">
          您為此查詢上傳的相關文件
        </p>

        {loading ? (
          <p className="text-sm text-slate-500">載入中…</p>
        ) : assets.length === 0 ? (
          <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
            尚未上傳任何文件
          </p>
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
                    {asset.originalName ?? "文件"}
                    {" · "}
                    {new Date(asset.createdAt).toLocaleDateString("zh-HK")}
                  </p>
                </div>
                {asset.url && (
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    查看
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
