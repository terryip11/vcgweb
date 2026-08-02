import AffiliatePartnerActions from "@/components/admin/AffiliatePartnerActions";
import { formatDateTime } from "@/lib/admin/constants";
import type { AffiliatePartner } from "@/types";

const STATUS_COLORS: Record<AffiliatePartner["status"], string> = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-600",
  suspended: "bg-slate-100 text-slate-600",
};

const STATUS_LABELS: Record<AffiliatePartner["status"], string> = {
  pending: "待審核",
  approved: "已批准",
  rejected: "已拒絕",
  suspended: "已暫停",
};

export default function AffiliatesTable({
  partners,
}: {
  partners: AffiliatePartner[];
}) {
  if (partners.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white px-6 py-16 text-center shadow-sm">
        <p className="text-sm text-slate-500">暫無推廣夥伴申請</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {partners.map((partner) => (
        <article
          key={partner.id}
          className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-bold text-slate-900">{partner.name}</h2>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[partner.status]}`}
                >
                  {STATUS_LABELS[partner.status]}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-600">
                {partner.phone}
                {partner.email && ` · ${partner.email}`}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {partner.channel && `渠道：${partner.channel} · `}
                申請於 {formatDateTime(partner.createdAt)}
              </p>
              {partner.website && (
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-xs text-blue-600 hover:underline"
                >
                  {partner.website}
                </a>
              )}
              {partner.audience && (
                <p className="mt-2 text-sm text-slate-600">{partner.audience}</p>
              )}
              {partner.commissionCplHkd != null && (
                <p className="mt-1 text-xs text-teal-600">
                  CPL：HK${partner.commissionCplHkd}/宗
                </p>
              )}
              {partner.userId && (
                <p className="mt-1 text-xs text-emerald-600">已綁定 /affiliate 後台</p>
              )}
            </div>
            {partner.referralCode && (
              <code className="rounded-lg bg-teal-50 px-3 py-1 text-sm font-bold text-teal-700">
                ref={partner.referralCode}
              </code>
            )}
          </div>

          <div className="mt-4">
            <AffiliatePartnerActions partner={partner} />
          </div>
        </article>
      ))}
    </div>
  );
}
