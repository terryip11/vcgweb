import Link from "next/link";
import { notFound } from "next/navigation";
import LeadDocumentsPanel from "@/components/admin/LeadDocumentsPanel";
import LeadStatusBadge from "@/components/admin/LeadStatusBadge";
import LeadUpdateForm from "@/components/admin/LeadUpdateForm";
import {
  formatDateTime,
  formatHKD,
  LOAN_CATEGORY_LABELS,
  whatsappUrl,
} from "@/lib/admin/constants";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminLeadById } from "@/lib/supabase/admin";

interface LeadDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminLeadDetailPage({
  params,
}: LeadDetailPageProps) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  const lead = await getAdminLeadById(supabase, id);

  if (!lead) notFound();

  const whatsappMessage = `你好 ${lead.name}，我係 VCG 創健佳，收到你嘅貸款查詢${
    lead.loanCategory
      ? `（${LOAN_CATEGORY_LABELS[lead.loanCategory]}）`
      : ""
  }，想同你跟進一下。`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/leads"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            ← 返回列表
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">{lead.name}</h1>
          <p className="mt-1 text-sm text-slate-500">
            提交於 {formatDateTime(lead.createdAt)}
          </p>
        </div>
        <LeadStatusBadge status={lead.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-bold text-slate-900">聯絡資料</h2>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-slate-500">電話</dt>
                <dd className="mt-1 font-medium text-slate-900">{lead.phone}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">電郵</dt>
                <dd className="mt-1 font-medium text-slate-900">
                  {lead.email ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">貸款類別</dt>
                <dd className="mt-1 font-medium text-slate-900">
                  {lead.loanCategory
                    ? LOAN_CATEGORY_LABELS[lead.loanCategory]
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">貸款金額</dt>
                <dd className="mt-1 font-medium text-slate-900">
                  {formatHKD(lead.loanAmount)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">來源</dt>
                <dd className="mt-1 font-medium text-slate-900">{lead.source}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">推廣代碼</dt>
                <dd className="mt-1 font-mono font-medium text-teal-700">
                  {lead.referralCode ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">關聯產品</dt>
                <dd className="mt-1 font-medium text-slate-900">
                  {lead.productId ?? "—"}
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`tel:${lead.phone}`}
                className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                撥打電話
              </a>
              <a
                href={whatsappUrl(lead.phone, whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                WhatsApp 跟進
              </a>
            </div>
          </div>

          <LeadDocumentsPanel leadId={lead.id} />
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-bold text-slate-900">跟進管理</h2>
          <LeadUpdateForm lead={lead} />
        </div>
      </div>
    </div>
  );
}
