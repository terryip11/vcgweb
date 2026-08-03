"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function MemberAffiliateApprovedBanner({
  partnerId,
  referralCode,
  approvedAt,
}: {
  partnerId: string;
  referralCode: string;
  approvedAt?: string;
}) {
  const [visible, setVisible] = useState(false);
  const storageKey = `vcg-affiliate-approved-seen-${partnerId}`;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(storageKey)) return;

    if (approvedAt) {
      const approvedMs = new Date(approvedAt).getTime();
      const daysSince = (Date.now() - approvedMs) / (1000 * 60 * 60 * 24);
      if (daysSince > 30) return;
    }

    setVisible(true);
  }, [approvedAt, storageKey]);

  if (!visible) return null;

  function dismiss() {
    localStorage.setItem(storageKey, "1");
    setVisible(false);
  }

  return (
    <div className="rounded-2xl border border-teal-200 bg-gradient-to-r from-teal-50 to-emerald-50 p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">
            推廣夥伴已批准
          </p>
          <p className="mt-1 font-bold text-slate-900">
            恭喜！您的推廣夥伴申請已獲批准
          </p>
          <p className="mt-1 text-sm text-slate-600">
            推廣代碼：<strong>{referralCode}</strong>
            。我們已發送確認電郵至您的信箱，請登入推廣後台開始推廣。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/affiliate"
            className="inline-flex rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white hover:bg-teal-700"
          >
            進入推廣後台
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-xl border border-teal-200 px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-100/50"
          >
            知道了
          </button>
        </div>
      </div>
    </div>
  );
}
