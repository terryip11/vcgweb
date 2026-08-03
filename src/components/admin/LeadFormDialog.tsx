"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LEAD_SOURCE_FILTER_OPTIONS,
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  LOAN_CATEGORIES,
  LOAN_CATEGORY_LABELS,
} from "@/lib/admin/constants";
import type { AdminLead, LeadStatus, LoanCategory } from "@/types";

export interface LeadFormValues {
  name: string;
  phone: string;
  email: string;
  loanAmount: string;
  loanCategory: LoanCategory | "";
  source: string;
  status: LeadStatus;
  notes: string;
}

const EMPTY_FORM: LeadFormValues = {
  name: "",
  phone: "",
  email: "",
  loanAmount: "",
  loanCategory: "",
  source: "admin_manual",
  status: "new",
  notes: "",
};

export function leadToFormValues(lead?: AdminLead): LeadFormValues {
  if (!lead) return EMPTY_FORM;
  return {
    name: lead.name,
    phone: lead.phone,
    email: lead.email ?? "",
    loanAmount: lead.loanAmount?.toString() ?? "",
    loanCategory: lead.loanCategory ?? "",
    source: lead.source,
    status: lead.status,
    notes: lead.notes ?? "",
  };
}

export default function LeadFormDialog({
  open,
  title,
  initial,
  leadId,
  onClose,
}: {
  open: boolean;
  title: string;
  initial?: AdminLead;
  leadId?: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [form, setForm] = useState<LeadFormValues>(() => leadToFormValues(initial));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) setForm(leadToFormValues(initial));
  }, [open, initial]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      name: form.name,
      phone: form.phone,
      email: form.email.trim() || null,
      loanAmount: form.loanAmount ? Number(form.loanAmount) : null,
      loanCategory: form.loanCategory || null,
      source: form.source,
      status: form.status,
      notes: form.notes.trim() || null,
    };

    try {
      const res = await fetch(
        leadId ? `/api/admin/leads/${leadId}` : "/api/admin/leads",
        {
          method: leadId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "儲存失敗");
        return;
      }

      onClose();
      router.refresh();
    } catch {
      setError("網絡錯誤，請重試");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
          >
            關閉
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="姓名 *"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
          />
          <input
            required
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="電話 *"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="電郵"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <select
              value={form.loanCategory}
              onChange={(e) =>
                setForm({
                  ...form,
                  loanCategory: e.target.value as LoanCategory | "",
                })
              }
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
            >
              <option value="">貸款類別</option>
              {LOAN_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {LOAN_CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={form.loanAmount}
              onChange={(e) => setForm({ ...form, loanAmount: e.target.value })}
              placeholder="貸款金額"
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
            />
          </div>
          <select
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value as LeadStatus })
            }
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {LEAD_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
          <select
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
          >
            {LEAD_SOURCE_FILTER_OPTIONS.filter((o) => o.value !== "all").map(
              (opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ),
            )}
            <option value="admin_manual">後台手動</option>
          </select>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={3}
            placeholder="內部備註"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
          />

          {error && <p className="text-xs text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "儲存中…" : "儲存"}
          </button>
        </form>
      </div>
    </div>
  );
}
