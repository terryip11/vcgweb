import { LEAD_STATUS_COLORS, LEAD_STATUS_LABELS } from "@/lib/admin/constants";
import type { LeadStatus } from "@/types";

export default function LeadStatusBadge({ status }: { status: LeadStatus | string }) {
  const key = status as LeadStatus;
  const label = LEAD_STATUS_LABELS[key] ?? status;
  const color = LEAD_STATUS_COLORS[key] ?? "bg-slate-100 text-slate-600";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}
    >
      {label}
    </span>
  );
}
