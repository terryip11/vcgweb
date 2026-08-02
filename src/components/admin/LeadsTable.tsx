import Link from "next/link";
import LeadStatusBadge from "@/components/admin/LeadStatusBadge";
import {
  formatDateTime,
  formatHKD,
  getLeadCategoryLabel,
  getLeadSourceLabel,
  whatsappUrl,
} from "@/lib/admin/constants";
import type { AdminLead } from "@/types";

export default function LeadsTable({ leads }: { leads: AdminLead[] }) {
  if (leads.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white px-6 py-16 text-center shadow-sm">
        <p className="text-sm text-slate-500">暫無查詢記錄</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
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
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                    >
                      詳情
                    </Link>
                    <a
                      href={whatsappUrl(
                        lead.phone,
                        `你好 ${lead.name}，我係 VCG 創健佳，收到你嘅貸款查詢，想同你跟進一下。`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                    >
                      WhatsApp
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
