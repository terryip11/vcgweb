"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LeadFormDialog from "@/components/admin/LeadFormDialog";
import LeadStatusBadge from "@/components/admin/LeadStatusBadge";
import {
  formatDateTime,
  formatHKD,
  getLeadCategoryLabel,
  getLeadSourceLabel,
  whatsappUrl,
} from "@/lib/admin/constants";
import type { AdminLead } from "@/types";

function LeadActions({
  lead,
  crud,
  onEdit,
}: {
  lead: AdminLead;
  crud?: boolean;
  onEdit: (lead: AdminLead) => void;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (
      !window.confirm(
        `確定刪除「${lead.name}」的查詢記錄？此操作無法復原。`,
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        window.alert(data.error ?? "刪除失敗");
        return;
      }
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={`/admin/leads/${lead.id}`}
        className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
      >
        詳情
      </Link>
      <a
        href={whatsappUrl(
          lead.phone,
          `你好 ${lead.name}，我係 VCG，收到你嘅貸款查詢，想同你跟進一下。`,
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
      >
        WhatsApp
      </a>
      {crud && (
        <>
          <button
            type="button"
            onClick={() => onEdit(lead)}
            className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
          >
            編輯
          </button>
          <button
            type="button"
            disabled={deleting}
            onClick={() => void handleDelete()}
            className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-60"
          >
            {deleting ? "刪除中…" : "刪除"}
          </button>
        </>
      )}
    </div>
  );
}

function LeadCard({
  lead,
  crud,
  onEdit,
}: {
  lead: AdminLead;
  crud?: boolean;
  onEdit: (lead: AdminLead) => void;
}) {
  return (
    <article className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-slate-900">{lead.name}</p>
          <p className="text-xs text-slate-500">{lead.phone}</p>
          {lead.email && (
            <p className="text-xs text-slate-400">{lead.email}</p>
          )}
        </div>
        <LeadStatusBadge status={lead.status} />
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
        <div>
          <dt className="text-slate-400">類別</dt>
          <dd className="font-medium">{getLeadCategoryLabel(lead)}</dd>
        </div>
        <div>
          <dt className="text-slate-400">金額</dt>
          <dd className="font-medium">{formatHKD(lead.loanAmount)}</dd>
        </div>
        <div>
          <dt className="text-slate-400">來源</dt>
          <dd className="font-medium">{getLeadSourceLabel(lead.source)}</dd>
        </div>
        <div>
          <dt className="text-slate-400">時間</dt>
          <dd className="font-medium">{formatDateTime(lead.createdAt)}</dd>
        </div>
      </dl>
      <div className="mt-3">
        <LeadActions lead={lead} crud={crud} onEdit={onEdit} />
      </div>
    </article>
  );
}

export default function LeadsTable({
  leads,
  crud = false,
  emptyMessage = "暫無查詢記錄",
}: {
  leads: AdminLead[];
  crud?: boolean;
  emptyMessage?: string;
}) {
  const [editing, setEditing] = useState<AdminLead | null>(null);

  if (leads.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white px-6 py-16 text-center shadow-sm">
        <p className="text-sm text-slate-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 lg:hidden">
        {leads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            crud={crud}
            onEdit={setEditing}
          />
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">客戶</th>
                <th className="px-4 py-3">類別 / 金額</th>
                <th className="px-4 py-3">來源</th>
                <th className="px-4 py-3">Ref</th>
                <th className="px-4 py-3">狀態</th>
                <th className="px-4 py-3">時間</th>
                <th className="px-4 py-3">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{lead.name}</p>
                    <p className="text-xs text-slate-500">{lead.phone}</p>
                    {lead.email && (
                      <p className="text-xs text-slate-400">{lead.email}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {getLeadCategoryLabel(lead)}
                    <p className="text-xs text-slate-400">
                      {formatHKD(lead.loanAmount)}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {getLeadSourceLabel(lead.source)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-teal-700">
                    {lead.referralCode ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <LeadStatusBadge status={lead.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {formatDateTime(lead.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <LeadActions lead={lead} crud={crud} onEdit={setEditing} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <LeadFormDialog
        open={Boolean(editing)}
        title="編輯查詢"
        initial={editing ?? undefined}
        leadId={editing?.id}
        onClose={() => setEditing(null)}
      />
    </>
  );
}
