import Link from "next/link";
import { AFFILIATE_CPA_SUCCESS_BONUS } from "@/data/affiliate-program";

export default function AffiliateCommissionPlanInfo() {
  const cpa = AFFILIATE_CPA_SUCCESS_BONUS;

  return (
    <div className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50/80 to-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
            佣金計劃說明
          </p>
          <h2 className="mt-1 text-lg font-bold text-slate-900">
            雙軌回報：CPL 查詢 + CPA 成功批核
          </h2>
        </div>
        <Link
          href="/partner/terms"
          className="text-xs font-semibold text-teal-700 hover:underline"
        >
          完整條款 →
        </Link>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-100 bg-white p-4">
          <p className="text-xs font-semibold text-slate-500">Phase 1 · CPL（後台即時估算）</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            有效查詢按約定 CPL 計佣（僅香港 IP，24 小時去重）。「待結算（估算）」反映此部分。
          </p>
        </div>

        <div className="rounded-xl border border-teal-200 bg-white p-4">
          <p className="text-xs font-semibold text-teal-700">
            CPA · 成功批核獎賞 {cpa.rateLabel}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            客戶成功批核後，連續 <strong>{cpa.observationMonths} 個月</strong>
            正常還款、無欠供及無提早清還／退款，按
            <strong>{cpa.basis}</strong> 的 {cpa.rateLabel} 額外回報。
          </p>
        </div>
      </div>

      <ul className="mt-4 space-y-1.5 text-sm text-slate-600">
        {cpa.conditions.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-teal-600">·</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs leading-relaxed text-slate-500">
        {cpa.settlementNote} {cpa.disclaimer}
      </p>
    </div>
  );
}
