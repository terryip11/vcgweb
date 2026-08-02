"use client";

import { useState } from "react";
import LeadDocumentUpload from "@/components/media/LeadDocumentUpload";
import TurnstileWidget, {
  useTurnstileRequired,
} from "@/components/security/TurnstileWidget";
import { getReferralCodeForLead } from "@/lib/analytics/track-click";
import type { EligibilityResult } from "@/data/sme-eligibility-questions";

const WHATSAPP_BASE = "https://wa.me/85264754756?text=";

interface SmeLeadCaptureFormProps {
  result: EligibilityResult;
}

export default function SmeLeadCaptureForm({ result }: SmeLeadCaptureFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRequired = useTurnstileRequired();

  const notes = [
    `問卷結果：${result.title}`,
    `符合必答題：${result.passedCount}/${result.totalRequired}`,
    result.warnings.length > 0
      ? `待確認：${result.warnings.join("；")}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (turnstileRequired && !turnstileToken) {
      setError("請完成人機驗證");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email: email.trim() || undefined,
          loanAmount: amount ? Number(amount) : undefined,
          loanCategory: "sme",
          source: "sme_quiz",
          notes,
          referralCode: getReferralCodeForLead() ?? undefined,
          turnstileToken,
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "submit failed");
      }
      const data = (await res.json()) as { id?: string };
      if (data.id) setLeadId(data.id);
      setSubmitted(true);
    } catch {
      setError("提交失敗，請稍後再試或直接 WhatsApp 聯絡");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    const waText = encodeURIComponent(
      `你好，我已完成八成信貸擔保資格問卷（${result.title}），姓名：${name}，想了解申請安排`,
    );
    return (
      <div className="mt-5 rounded-xl border border-emerald-200 bg-white p-4">
        <p className="text-sm font-semibold text-emerald-800">查詢已提交！</p>
        <p className="mt-1 text-xs text-slate-600">
          VCG 顧問將在 24 小時內聯絡您，您亦可立即 WhatsApp 跟進。
        </p>
        <a
          href={`${WHATSAPP_BASE}${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-400 sm:w-auto"
        >
          WhatsApp 立即聯絡
        </a>
        {leadId && (
          <div className="mt-4">
            <LeadDocumentUpload leadId={leadId} />
          </div>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-5 rounded-xl border border-white/60 bg-white/90 p-4 backdrop-blur"
    >
      <p className="mb-3 text-sm font-semibold text-slate-900">
        留下聯絡方式，VCG 免費跟進
      </p>
      <div className="space-y-3">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="姓名 *"
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
        />
        <input
          required
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="電話 *"
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="電郵（選填）"
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="所需貸款金額（選填）"
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
        />
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      <TurnstileWidget onToken={setTurnstileToken} className="mt-3" />

      <button
        type="submit"
        disabled={loading}
        className="mt-3 w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "提交中…" : "提交查詢"}
      </button>
    </form>
  );
}
