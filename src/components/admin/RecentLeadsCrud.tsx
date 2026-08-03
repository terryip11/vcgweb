"use client";

import { useState } from "react";
import LeadFormDialog from "@/components/admin/LeadFormDialog";
import LeadsTable from "@/components/admin/LeadsTable";
import type { AdminLead } from "@/types";

export default function RecentLeadsCrud({ leads }: { leads: AdminLead[] }) {
  const [creating, setCreating] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          可直接在此新增、編輯或刪除最新查詢
        </p>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
        >
          + 新增查詢
        </button>
      </div>

      <LeadsTable leads={leads} crud emptyMessage="暫無查詢，可按「新增查詢」建立" />

      <LeadFormDialog
        open={creating}
        title="新增查詢"
        onClose={() => setCreating(false)}
      />
    </div>
  );
}
