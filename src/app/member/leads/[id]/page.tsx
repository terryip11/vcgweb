import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import LeadStatusBadge from "@/components/admin/LeadStatusBadge";
import LeadProgressBar from "@/components/member/LeadProgressBar";
import MemberLeadDocuments from "@/components/member/MemberLeadDocuments";
import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import {
  formatDateTime,
  formatHKD,
  LOAN_CATEGORY_LABELS,
  whatsappUrl,
} from "@/lib/admin/constants";
import {
  memberLeadWhatsAppMessage,
  MEMBER_STATUS_MESSAGES,
  VCG_WHATSAPP,
} from "@/lib/member/constants";
import { getMemberLeadById } from "@/lib/supabase/member";
import { createClient } from "@/lib/supabase/server";
import type { LeadStatus, LoanCategory } from "@/types";

interface MemberLeadDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: MemberLeadDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `查詢詳情 #${id.slice(0, 8).toUpperCase()} | 會員中心 | VCG`,
  };
}

export default async function MemberLeadDetailPage({
  params,
}: MemberLeadDetailPageProps) {
  const supabase = await createClient();
  if (!supabase) redirect("/login?next=/member");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/member");

  const { id } = await params;
  const lead = await getMemberLeadById(supabase, user.id, id);
  if (!lead) notFound();

  const leadStatus = lead.status as LeadStatus;
  const categoryLabel = lead.loanCategory
    ? LOAN_CATEGORY_LABELS[lead.loanCategory as LoanCategory]
    : undefined;
  const statusMessage =
    MEMBER_STATUS_MESSAGES[leadStatus] ??
    "VCG 顧問正在跟進您的查詢，如有疑問歡迎聯絡我們。";
  const whatsappMessage = memberLeadWhatsAppMessage({
    leadId: lead.id,
    name: lead.name,
    categoryLabel,
  });

  return (
    <PageShell>
      <PageHero
        badge="查詢詳情"
        title={categoryLabel ? `${categoryLabel}查詢` : "貸款查詢"}
        subtitle={`查詢編號 #${lead.id.slice(0, 8).toUpperCase()} · 提交於 ${formatDateTime(lead.createdAt)}`}
      />

      <section className="py-12">
        <div className="mx-auto max-w-4xl space-y-6 px-4">
          <Link
            href="/member"
            className="inline-flex text-sm font-medium text-blue-600 hover:underline"
          >
            ← 返回會員中心
          </Link>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">處理進度</h2>
                <p className="mt-1 text-sm text-slate-500">{statusMessage}</p>
              </div>
              <LeadStatusBadge status={lead.status} />
            </div>
            <LeadProgressBar status={lead.status} />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-sm font-bold text-slate-900">查詢資料</h2>
                <dl className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-slate-500">申請人</dt>
                    <dd className="mt-1 font-medium text-slate-900">{lead.name}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">聯絡電話</dt>
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
                      {categoryLabel ?? "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">貸款金額</dt>
                    <dd className="mt-1 font-medium text-slate-900">
                      {formatHKD(lead.loanAmount)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">提交時間</dt>
                    <dd className="mt-1 font-medium text-slate-900">
                      {formatDateTime(lead.createdAt)}
                    </dd>
                  </div>
                </dl>
              </div>

              <MemberLeadDocuments leadId={lead.id} />
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 shadow-sm">
                <h2 className="text-sm font-bold text-slate-900">需要協助？</h2>
                <p className="mt-2 text-sm text-slate-600">
                  查詢後 24 小時內如有疑問，歡迎透過 WhatsApp 直接聯絡 VCG 顧問。
                </p>
                <a
                  href={whatsappUrl(VCG_WHATSAPP, whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp 聯絡 VCG
                </a>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h2 className="text-sm font-bold text-slate-900">下一步</h2>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li>· VCG 顧問會按您的需求配對方案</li>
                  <li>· 如需補充文件，可於上方上傳</li>
                  <li>· 進度更新後會在此頁面顯示</li>
                </ul>
                <Link
                  href="/compare"
                  className="mt-4 block rounded-xl border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
                >
                  瀏覽更多貸款方案
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
