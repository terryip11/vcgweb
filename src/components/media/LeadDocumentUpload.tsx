"use client";

import { useState } from "react";
import ImageUpload from "@/components/media/ImageUpload";
import { MEDIA_CATEGORY_LABELS } from "@/lib/r2/config";

const LEAD_DOC_TYPES = [
  { category: "lead_br", label: "商業登記證" },
  { category: "lead_bank_statement", label: "銀行月結單" },
  { category: "lead_id", label: "身份證明" },
  { category: "lead_financial", label: "財務報表" },
  { category: "lead_other", label: "其他文件" },
] as const;

export default function LeadDocumentUpload({
  leadId,
  onUploaded,
}: {
  leadId: string;
  onUploaded?: () => void;
}) {
  const [activeCategory, setActiveCategory] = useState<string>("lead_br");
  const [uploadedCount, setUploadedCount] = useState(0);

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="mb-1 text-sm font-semibold text-slate-900">
        上傳相關文件（可選）
      </p>
      <p className="mb-4 text-xs text-slate-500">
        支援 JPG、PNG、PDF，單檔最大 5MB
        {uploadedCount > 0 && ` · 已上傳 ${uploadedCount} 個`}
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {LEAD_DOC_TYPES.map((type) => (
          <button
            key={type.category}
            type="button"
            onClick={() => setActiveCategory(type.category)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              activeCategory === type.category
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      <ImageUpload
        entityType="lead"
        entityId={leadId}
        category={activeCategory}
        label={MEDIA_CATEGORY_LABELS[activeCategory]}
        accept="image/jpeg,image/png,image/webp,application/pdf"
        onUploaded={() => {
          setUploadedCount((c) => c + 1);
          onUploaded?.();
        }}
      />
    </div>
  );
}
