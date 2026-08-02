"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import LeadStatusBadge from "@/components/admin/LeadStatusBadge";
import {
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
} from "@/lib/admin/constants";
import type { AdminLead, LeadStatus } from "@/types";

export default function LeadUpdateForm({ lead }: { lead: AdminLead }) {
  const router = useRouter();
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes: notes.trim() || null }),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "更新失敗");
        return;
      }

      setMessage("已儲存");
      router.refresh();
    } catch {
      setError("網絡錯誤，請重試");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          目前狀態
        </p>
        <LeadStatusBadge status={status} />
      </div>

      <div>
        <label
          htmlFor="lead-status"
          className="mb-1 block text-xs font-semibold text-slate-500"
        >
          更新狀態
        </label>
        <select
          id="lead-status"
          value={status}
          onChange={(e) => setStatus(e.target.value as LeadStatus)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        >
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {LEAD_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="lead-notes"
          className="mb-1 block text-xs font-semibold text-slate-500"
        >
          內部備註
        </label>
        <textarea
          id="lead-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={5}
          placeholder="跟進記錄、客戶需求、轉介銀行等…"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "儲存中…" : "儲存更新"}
      </button>
    </form>
  );
}
