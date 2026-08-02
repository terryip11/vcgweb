"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AffiliatePartner } from "@/types";

const STATUS_LABELS: Record<AffiliatePartner["status"], string> = {
  pending: "待審核",
  approved: "已批准",
  rejected: "已拒絕",
  suspended: "已暫停",
};

export default function AffiliatePartnerActions({
  partner,
}: {
  partner: AffiliatePartner;
}) {
  const router = useRouter();
  const [referralCode, setReferralCode] = useState(partner.referralCode ?? "");
  const [notes, setNotes] = useState(partner.notes ?? "");
  const [commissionCpl, setCommissionCpl] = useState(
    partner.commissionCplHkd?.toString() ?? "",
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [periodLabel, setPeriodLabel] = useState(
    new Date().toISOString().slice(0, 7),
  );
  const [settleLeads, setSettleLeads] = useState("");
  const [settleAmount, setSettleAmount] = useState("");
  const [settleLoading, setSettleLoading] = useState(false);

  async function update(status?: AffiliatePartner["status"]) {
    setLoading(true);
    setMessage(null);

    const res = await fetch(`/api/admin/affiliates/${partner.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        referralCode: referralCode.trim() || null,
        notes: notes.trim() || null,
        commissionCplHkd: commissionCpl ? Number(commissionCpl) : null,
      }),
    });

    setLoading(false);
    if (!res.ok) {
      setMessage("更新失敗");
      return;
    }

    setMessage("已儲存");
    router.refresh();
  }

  async function createSettlement(markPaid: boolean) {
    setSettleLoading(true);
    setMessage(null);

    const res = await fetch(
      `/api/admin/affiliates/${partner.id}/commissions`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          periodLabel,
          leadCount: Number(settleLeads),
          amountHkd: Number(settleAmount),
          markPaid,
        }),
      },
    );

    setSettleLoading(false);
    if (!res.ok) {
      setMessage("結算記錄建立失敗");
      return;
    }

    setMessage(markPaid ? "已記錄並標記為已支付" : "已建立待結算記錄");
    router.refresh();
  }

  const siteUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3001";

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            推廣代碼 (ref)
          </label>
          <input
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
            placeholder="例如 VCGKOL01"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm uppercase outline-none focus:border-blue-400"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            CPL 佣金 (HKD/宗)
          </label>
          <input
            type="number"
            min={0}
            step={1}
            value={commissionCpl}
            onChange={(e) => setCommissionCpl(e.target.value)}
            placeholder="例如 150"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
          />
        </div>
      </div>

      {referralCode && (
        <p className="break-all text-xs text-slate-500">
          連結：{siteUrl}/compare?ref={referralCode.trim().toUpperCase()}
          {" · "}
          夥伴後台：{siteUrl}/affiliate
        </p>
      )}

      {partner.userId && (
        <p className="text-xs text-emerald-600">已綁定會員帳戶，可使用 /affiliate 後台</p>
      )}

      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-500">
          備註
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={loading}
          onClick={() => void update("approved")}
          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          批准
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => void update("rejected")}
          className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-60"
        >
          拒絕
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => void update()}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          儲存
        </button>
      </div>

      <div className="border-t border-slate-200 pt-4">
        <p className="mb-2 text-xs font-bold text-slate-700">月結算記錄</p>
        <div className="grid gap-2 sm:grid-cols-3">
          <input
            value={periodLabel}
            onChange={(e) => setPeriodLabel(e.target.value)}
            placeholder="2026-08"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
          />
          <input
            type="number"
            min={0}
            value={settleLeads}
            onChange={(e) => setSettleLeads(e.target.value)}
            placeholder="有效查詢數"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
          />
          <input
            type="number"
            min={0}
            step={0.01}
            value={settleAmount}
            onChange={(e) => setSettleAmount(e.target.value)}
            placeholder="金額 HKD"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={settleLoading}
            onClick={() => void createSettlement(false)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
          >
            建立待結算
          </button>
          <button
            type="button"
            disabled={settleLoading}
            onClick={() => void createSettlement(true)}
            className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-700 disabled:opacity-60"
          >
            記錄已支付
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        狀態：{STATUS_LABELS[partner.status]}
      </p>
      {message && (
        <p
          className={`text-xs ${message.includes("失敗") ? "text-red-600" : "text-emerald-600"}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
