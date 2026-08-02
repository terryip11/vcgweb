import type { MemberLeadStats } from "@/types";

interface MemberLeadSummaryProps {
  stats: MemberLeadStats;
}

export default function MemberLeadSummary({ stats }: MemberLeadSummaryProps) {
  const items = [
    {
      label: "查詢總數",
      value: stats.total,
      hint: "透過 VCG 提交的查詢",
      color: "text-slate-900",
      bg: "bg-slate-50",
    },
    {
      label: "待跟進",
      value: stats.pending,
      hint: "正在處理中的查詢",
      color: "text-amber-700",
      bg: "bg-amber-50",
    },
    {
      label: "已完成",
      value: stats.completed,
      hint: "成功完成的查詢",
      color: "text-emerald-700",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className={`rounded-2xl border border-slate-100 ${item.bg} p-5 shadow-sm`}
        >
          <p className="text-xs font-semibold text-slate-500">{item.label}</p>
          <p className={`mt-1 text-3xl font-bold ${item.color}`}>{item.value}</p>
          <p className="mt-1 text-xs text-slate-500">{item.hint}</p>
        </div>
      ))}
    </div>
  );
}
