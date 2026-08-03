"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AFFILIATE_AUDIENCE_TYPES } from "@/data/affiliate-program";
import type { AffiliatePartner } from "@/types";

const STATUSES: AffiliatePartner["status"][] = [
  "pending",
  "approved",
  "rejected",
  "suspended",
];

const STATUS_LABELS: Record<AffiliatePartner["status"], string> = {
  pending: "待審核",
  approved: "已批准",
  rejected: "已拒絕",
  suspended: "已暫停",
};

export interface AffiliateFormValues {
  name: string;
  phone: string;
  email: string;
  channel: string;
  website: string;
  audience: string;
  referralCode: string;
  commissionCpl: string;
  status: AffiliatePartner["status"];
  notes: string;
}

function partnerToFormValues(partner?: AffiliatePartner): AffiliateFormValues {
  return {
    name: partner?.name ?? "",
    phone: partner?.phone ?? "",
    email: partner?.email ?? "",
    channel: partner?.channel ?? "",
    website: partner?.website ?? "",
    audience: partner?.audience ?? "",
    referralCode: partner?.referralCode ?? "",
    commissionCpl: partner?.commissionCplHkd?.toString() ?? "",
    status: partner?.status ?? "pending",
    notes: partner?.notes ?? "",
  };
}

export default function AffiliateFormDialog({
  open,
  title,
  initial,
  partnerId,
  onClose,
}: {
  open: boolean;
  title: string;
  initial?: AffiliatePartner;
  partnerId?: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const isEdit = Boolean(partnerId);
  const [form, setForm] = useState<AffiliateFormValues>(() =>
    partnerToFormValues(initial),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) setForm(partnerToFormValues(initial));
  }, [open, initial]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      channel: form.channel.trim() || null,
      website: form.website.trim() || null,
      audience: form.audience.trim() || null,
      referralCode: form.referralCode.trim() || null,
      commissionCplHkd: form.commissionCpl ? Number(form.commissionCpl) : null,
      status: form.status,
      notes: form.notes.trim() || null,
    };

    try {
      const res = await fetch(
        isEdit ? `/api/admin/affiliates/${partnerId}` : "/api/admin/affiliates",
        {
          method: isEdit ? "PATCH" : "POST",
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
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
            aria-label="關閉"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">
              姓名 *
            </span>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500">
                電話 *
              </span>
              <input
                required
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500">
                電郵
              </span>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">
              渠道
            </span>
            <select
              value={form.channel}
              onChange={(e) =>
                setForm((f) => ({ ...f, channel: e.target.value }))
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
            >
              <option value="">—</option>
              {AFFILIATE_AUDIENCE_TYPES.map((item) => (
                <option key={item.id} value={item.label}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">
              網站
            </span>
            <input
              value={form.website}
              onChange={(e) =>
                setForm((f) => ({ ...f, website: e.target.value }))
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">
              受眾描述
            </span>
            <textarea
              value={form.audience}
              onChange={(e) =>
                setForm((f) => ({ ...f, audience: e.target.value }))
              }
              rows={2}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500">
                推廣代碼 (ref)
              </span>
              <input
                value={form.referralCode}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    referralCode: e.target.value.toUpperCase(),
                  }))
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm uppercase outline-none focus:border-blue-400"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500">
                CPL (HKD/宗)
              </span>
              <input
                type="number"
                min={0}
                value={form.commissionCpl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, commissionCpl: e.target.value }))
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">
              狀態
            </span>
            <select
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  status: e.target.value as AffiliatePartner["status"],
                }))
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">
              備註
            </span>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={2}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "儲存中…" : "儲存"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
