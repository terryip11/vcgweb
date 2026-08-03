"use client";

import { useEffect, useState } from "react";
import { formatDateTime } from "@/lib/admin/constants";
import type { AffiliateCommission } from "@/types";

const STATUS_LABELS: Record<AffiliateCommission["status"], string> = {
  pending: "待結算",
  paid: "已支付",
  void: "作廢",
};

export default function AffiliateCommissionsList({
  affiliateId,
  refreshKey,
}: {
  affiliateId: string;
  refreshKey?: number;
}) {
  const [commissions, setCommissions] = useState<AffiliateCommission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const res = await fetch(`/api/admin/affiliates/${affiliateId}/commissions`);
      if (!cancelled && res.ok) {
        const data = (await res.json()) as { commissions: AffiliateCommission[] };
        setCommissions(data.commissions ?? []);
      }
      if (!cancelled) setLoading(false);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [affiliateId, refreshKey]);

  if (loading) {
    return <p className="text-xs text-slate-500">載入結算記錄…</p>;
  }

  if (commissions.length === 0) {
    return <p className="text-xs text-slate-500">尚未有結算記錄</p>;
  }

  return (
    <ul className="mt-2 space-y-2">
      {commissions.map((item) => (
        <li
          key={item.id}
          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
        >
          <div>
            <p className="font-semibold text-slate-900">{item.periodLabel}</p>
            <p className="text-slate-500">
              {item.leadCount} 宗 · HK${item.amountHkd.toLocaleString("zh-HK")}
            </p>
            <p className="text-slate-400">
              {formatDateTime(item.createdAt)}
              {item.paidAt && ` · 支付 ${formatDateTime(item.paidAt)}`}
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-700">
            {STATUS_LABELS[item.status]}
          </span>
        </li>
      ))}
    </ul>
  );
}
