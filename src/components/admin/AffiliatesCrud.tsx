"use client";

import { useState } from "react";
import AffiliateFormDialog from "@/components/admin/AffiliateFormDialog";
import AffiliatesTable from "@/components/admin/AffiliatesTable";
import type {
  AffiliatePartner,
  AffiliatePartnerPerformanceStats,
} from "@/types";

export default function AffiliatesCrud({
  partners,
  statsByCode,
}: {
  partners: AffiliatePartner[];
  statsByCode: Record<string, AffiliatePartnerPerformanceStats>;
}) {
  const [creating, setCreating] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          可新增、編輯或刪除推廣夥伴；批准後會電郵通知申請人。夥伴後台數據僅計
          香港 IP 點擊及查詢。
        </p>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
        >
          + 新增夥伴
        </button>
      </div>

      <AffiliatesTable partners={partners} statsByCode={statsByCode} />

      <AffiliateFormDialog
        open={creating}
        title="新增推廣夥伴"
        onClose={() => setCreating(false)}
      />
    </div>
  );
}
