"use client";

import { useState } from "react";
import LeadDocumentUpload from "@/components/media/LeadDocumentUpload";
import TurnstileWidget, {
  useTurnstileRequired,
} from "@/components/security/TurnstileWidget";
import { getReferralCodeForLead } from "@/lib/analytics/track-click";
import type { Product } from "@/types";

interface LeadModalProps {
  product: Product;
  onClose: () => void;
}

export default function LeadModal({ product, onClose }: LeadModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [leadId, setLeadId] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRequired = useTurnstileRequired();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (turnstileRequired && !turnstileToken) {
      setStatus("error");
      return;
    }
    setStatus("loading");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          loanAmount: amount ? Number(amount) : undefined,
          loanCategory: product.category,
          productId: product.id,
          source: "comparison_table",
          referralCode: getReferralCodeForLead() ?? undefined,
          turnstileToken,
        }),
      });

      if (!res.ok) throw new Error("submit failed");
      const data = (await res.json()) as { id?: string };
      if (data.id) setLeadId(data.id);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        {status === "success" ? (
          <div className="text-center">
            <div className="mb-4 text-4xl">✅</div>
            <h3 className="mb-2 text-xl font-bold text-slate-900">
              申請已提交！
            </h3>
            <p className="mb-6 text-sm text-slate-500">
              我們會在 24 小時內以 WhatsApp 或電話聯絡您，跟進{" "}
              {product.name} 申請。
            </p>
            {leadId && <LeadDocumentUpload leadId={leadId} />}
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white"
            >
              關閉
            </button>
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-amber-600">立即申請</p>
                <h3 className="text-lg font-bold text-slate-900">
                  {product.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600"
                aria-label="關閉"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-slate-500">
                  姓名 *
                </span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  placeholder="您的姓名"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-medium text-slate-500">
                  電話 *
                </span>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  placeholder="9XXX XXXX"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-medium text-slate-500">
                  所需貸款金額（選填）
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  placeholder="例如 200000"
                />
              </label>

              {status === "error" && (
                <p className="text-sm text-red-500">
                  提交失敗，請稍後再試或直接 WhatsApp 查詢。
                </p>
              )}

              <TurnstileWidget onToken={setTurnstileToken} />

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-xl bg-amber-500 py-3.5 text-sm font-bold text-slate-900 transition hover:bg-amber-400 disabled:opacity-60"
              >
                {status === "loading" ? "提交中…" : "提交申請"}
              </button>

              <p className="text-center text-xs text-slate-400">
                提交即表示同意我們的私隱政策。VCG 將把您的資料轉介至相關金融機構。
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
