"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import AffiliateFormDialog from "@/components/admin/AffiliateFormDialog";
import AffiliatePartnerActions from "@/components/admin/AffiliatePartnerActions";
import AffiliatePartnerStatsBar from "@/components/admin/AffiliatePartnerStatsBar";
import { formatDateTime } from "@/lib/admin/constants";
import type {
  AffiliatePartner,
  AffiliatePartnerPerformanceStats,
} from "@/types";

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

function formatRate(rate: number | null) {
  if (rate == null) return "—";
  return `${rate}%`;
}

function PartnerHeaderActions({
  partner,
  onEdit,
}: {
  partner: AffiliatePartner;
  onEdit: (partner: AffiliatePartner) => void;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (
      !window.confirm(
        `確定刪除「${partner.name}」的推廣夥伴記錄？結算記錄亦會一併刪除，此操作無法復原。`,
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/affiliates/${partner.id}`, {
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
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onEdit(partner)}
        className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
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
    </div>
  );
}

function PartnerCard({
  partner,
  stats,
  onEdit,
}: {
  partner: AffiliatePartner;
  stats?: AffiliatePartnerPerformanceStats;
  onEdit: (partner: AffiliatePartner) => void;
}) {
  const defaultExpanded = partner.status === "pending";
  const [expanded, setExpanded] = useState(defaultExpanded);
  const code = partner.referralCode?.toUpperCase();

  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-bold text-slate-900">{partner.name}</h2>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[partner.status]}`}
            >
              {STATUS_LABELS[partner.status]}
            </span>
            {partner.status === "pending" && (
              <span className="rounded-full bg-amber-500 px-2 py-0.5 text-xs font-bold text-white">
                待處理
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-600">
            {partner.phone}
            {partner.email && ` · ${partner.email}`}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {partner.channel && `渠道：${partner.channel} · `}
            申請於 {formatDateTime(partner.createdAt)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {code && (
            <code className="rounded-lg bg-teal-50 px-3 py-1 text-sm font-bold text-teal-700">
              ref={code}
            </code>
          )}
          <PartnerHeaderActions partner={partner} onEdit={onEdit} />
        </div>
      </div>

      <div className="mt-4">
        <AffiliatePartnerStatsBar referralCode={code} stats={stats} />
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-xs font-semibold text-slate-600 hover:text-blue-600"
        >
          {expanded ? "收起管理操作 ▲" : "展開管理操作 ▼"}
        </button>
        {expanded && (
          <div className="mt-3">
            <AffiliatePartnerActions partner={partner} stats={stats} />
          </div>
        )}
      </div>
    </article>
  );
}

function PerformanceTable({
  partners,
  statsByCode,
  onEdit,
}: {
  partners: AffiliatePartner[];
  statsByCode: Record<string, AffiliatePartnerPerformanceStats>;
  onEdit: (partner: AffiliatePartner) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="hidden overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm lg:block">
      <table className="min-w-full text-sm">
        <thead className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">夥伴</th>
            <th className="px-4 py-3">ref</th>
            <th className="px-4 py-3">狀態</th>
            <th className="px-4 py-3">總點擊</th>
            <th className="px-4 py-3">本週點擊</th>
            <th className="px-4 py-3">總查詢</th>
            <th className="px-4 py-3">本週查詢</th>
            <th className="px-4 py-3">轉化率</th>
            <th className="px-4 py-3">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {partners.map((partner) => {
            const code = partner.referralCode?.toUpperCase() ?? "";
            const stats = code ? statsByCode[code] : undefined;
            const expanded = expandedId === partner.id;
            return (
              <Fragment key={partner.id}>
                <tr className="hover:bg-slate-50/80">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{partner.name}</p>
                    <p className="text-xs text-slate-500">{partner.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    {code ? (
                      <code className="font-bold text-teal-700">{code}</code>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[partner.status]}`}
                    >
                      {STATUS_LABELS[partner.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">{stats?.totalClicks ?? "—"}</td>
                  <td className="px-4 py-3 text-blue-600">+{stats?.weekClicks ?? 0}</td>
                  <td className="px-4 py-3 font-medium">{stats?.totalLeads ?? "—"}</td>
                  <td className="px-4 py-3 font-bold text-blue-600">
                    +{stats?.weekLeads ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    {formatRate(stats?.conversionRate ?? null)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId(expanded ? null : partner.id)
                        }
                        className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                      >
                        {expanded ? "收起" : "管理"}
                      </button>
                      {code && (
                        <Link
                          href={`/admin/leads?ref=${encodeURIComponent(code)}`}
                          className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                        >
                          查詢
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => onEdit(partner)}
                        className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                      >
                        編輯
                      </button>
                    </div>
                  </td>
                </tr>
                {expanded && (
                  <tr>
                    <td colSpan={9} className="bg-slate-50 px-4 py-4">
                      <AffiliatePartnerActions partner={partner} stats={stats} />
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
      <p className="border-t border-slate-100 px-4 py-2 text-xs text-slate-400">
        數據僅香港 IP。點「管理」可批准、結算及設定 ref。
      </p>
    </div>
  );
}

export default function AffiliatesTable({
  partners,
  statsByCode,
}: {
  partners: AffiliatePartner[];
  statsByCode: Record<string, AffiliatePartnerPerformanceStats>;
}) {
  const [editing, setEditing] = useState<AffiliatePartner | null>(null);

  if (partners.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white px-6 py-16 text-center shadow-sm">
        <p className="text-sm text-slate-500">暫無推廣夥伴</p>
      </div>
    );
  }

  return (
    <>
      <PerformanceTable
        partners={partners}
        statsByCode={statsByCode}
        onEdit={setEditing}
      />

      <div className="space-y-6 lg:hidden">
        {partners.map((partner) => (
          <PartnerCard
            key={partner.id}
            partner={partner}
            stats={
              partner.referralCode
                ? statsByCode[partner.referralCode.toUpperCase()]
                : undefined
            }
            onEdit={setEditing}
          />
        ))}
      </div>

      <AffiliateFormDialog
        open={Boolean(editing)}
        title="編輯推廣夥伴"
        initial={editing ?? undefined}
        partnerId={editing?.id}
        onClose={() => setEditing(null)}
      />
    </>
  );
}
