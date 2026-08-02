"use client";

interface ExportLeadsButtonProps {
  status?: string;
  source?: string;
  q?: string;
}

export default function ExportLeadsButton({
  status,
  source,
  q,
}: ExportLeadsButtonProps) {
  function handleExport() {
    const params = new URLSearchParams();
    if (status && status !== "all") params.set("status", status);
    if (source && source !== "all") params.set("source", source);
    if (q) params.set("q", q);
    const qs = params.toString();
    window.location.href = `/api/admin/leads/export${qs ? `?${qs}` : ""}`;
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
    >
      匯出 CSV
    </button>
  );
}
