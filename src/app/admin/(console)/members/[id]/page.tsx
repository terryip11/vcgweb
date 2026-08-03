import Link from "next/link";
import { notFound } from "next/navigation";
import LeadStatusBadge from "@/components/admin/LeadStatusBadge";
import MemberUpdatePanel from "@/components/admin/MemberUpdatePanel";
import {
  formatDateTime,
  formatHKD,
  LOAN_CATEGORY_LABELS,
  USER_ROLE_LABELS,
} from "@/lib/admin/constants";
import { requireAdmin } from "@/lib/admin/auth";
import {
  getAdminLeadsByUserId,
  getAdminMemberById,
} from "@/lib/supabase/admin";

interface MemberDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminMemberDetailPage({
  params,
}: MemberDetailPageProps) {
  const { supabase } = await requireAdmin();
  const { id } = await params;

  const member = await getAdminMemberById(supabase, id);
  if (!member) notFound();

  const leads = await getAdminLeadsByUserId(supabase, id);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/members"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← 返回會員列表
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          {member.fullName ?? member.email ?? "會員詳情"}
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-1">
          <div className="flex items-center gap-4">
            {member.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={member.avatarUrl}
                alt=""
                className="h-16 w-16 rounded-full object-cover ring-2 ring-blue-100"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700">
                {(member.fullName ?? member.email ?? "?")
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-bold text-slate-900">
                {member.fullName ?? "—"}
              </p>
              <p className="text-sm text-slate-500">{member.email ?? "—"}</p>
              <span className="mt-1 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                {USER_ROLE_LABELS[member.role]}
              </span>
            </div>
          </div>

          <dl className="mt-6 space-y-3 text-sm">
            <div>
              <dt className="text-xs text-slate-500">電話</dt>
              <dd className="font-medium text-slate-900">{member.phone ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">註冊時間</dt>
              <dd className="font-medium text-slate-900">
                {formatDateTime(member.createdAt)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">查詢數</dt>
              <dd className="font-medium text-slate-900">{member.leadCount}</dd>
            </div>
          </dl>

          <MemberUpdatePanel member={member} />
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-sm font-bold text-slate-900">查詢記錄</h2>

          {leads.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              此會員暫無查詢記錄
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {leads.map((lead) => (
                <li key={lead.id} className="py-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-900">{lead.name}</p>
                      <p className="text-sm text-slate-500">
                        {lead.phone}
                        {lead.email && ` · ${lead.email}`}
                      </p>
                    </div>
                    <LeadStatusBadge status={lead.status} />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    {lead.loanCategory &&
                      LOAN_CATEGORY_LABELS[lead.loanCategory]}
                    {lead.loanAmount && ` · ${formatHKD(lead.loanAmount)}`}
                    {" · "}
                    {formatDateTime(lead.createdAt)}
                  </p>
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="mt-2 inline-block text-xs font-semibold text-blue-600 hover:underline"
                  >
                    查看詳情 →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
