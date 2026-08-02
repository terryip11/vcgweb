"use client";

import Link from "next/link";
import { useState } from "react";
import TurnstileWidget, {
  useTurnstileRequired,
} from "@/components/security/TurnstileWidget";
import { AFFILIATE_AUDIENCE_TYPES } from "@/data/affiliate-program";

export default function AffiliateApplicationForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [channel, setChannel] = useState("kol");
  const [website, setWebsite] = useState("");
  const [audience, setAudience] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRequired = useTurnstileRequired();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (turnstileRequired && !turnstileToken) {
      setError("請完成人機驗證");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/affiliate/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email: email.trim(),
          channel,
          website: website.trim() || undefined,
          audience: audience.trim() || undefined,
          turnstileToken,
        }),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "failed");
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error && err.message !== "failed"
          ? err.message
          : "提交失敗，請稍後再試或直接 WhatsApp 聯絡",
      );
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="text-lg font-bold text-emerald-800">申請已收到！</p>
        <p className="mt-1 text-xs text-slate-600">
          VCG 將在 1–3 個工作天內審核，通過後會以 WhatsApp 或電郵通知，並發送您的專屬推廣代碼（ref）。
          批准後請用<strong>相同電郵</strong>登入{" "}
          <Link href="/affiliate" className="font-semibold text-teal-600 hover:underline">
            推廣夥伴後台
          </Link>
          。
        </p>
        <a
          href="https://wa.me/85264754756?text=你好，我已提交 VCG 推廣夥伴申請"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
        >
          WhatsApp 跟進
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-bold text-slate-900">申請成為推廣夥伴</h2>
      <p className="mt-1 text-sm text-slate-500">
        填寫以下資料，VCG 團隊將與您聯絡（電郵須與日後登入帳戶一致）
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="聯絡人姓名 *"
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-400 sm:col-span-2"
        />
        <input
          required
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="電話 *"
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-400"
        />
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="電郵 *（須與登入帳戶相同）"
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-400"
        />
        <select
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-400 sm:col-span-2"
        >
          {AFFILIATE_AUDIENCE_TYPES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
        <input
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="網站 / 社交媒體連結（選填）"
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-400 sm:col-span-2"
        />
        <textarea
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          placeholder="簡述您的受眾及推廣渠道（選填）"
          rows={3}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-400 sm:col-span-2"
        />
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <TurnstileWidget onToken={setTurnstileToken} className="mt-4" />

      <button
        type="submit"
        disabled={loading}
        className="mt-5 w-full rounded-xl bg-teal-600 py-3 text-sm font-bold text-white hover:bg-teal-700 disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {loading ? "提交中…" : "提交申請"}
      </button>

      <p className="mt-4 text-xs leading-relaxed text-slate-400">
        提交即表示同意{" "}
        <Link href="/partner/terms" className="text-teal-600 hover:underline">
          VCG 推廣夥伴條款
        </Link>
        及{" "}
        <Link href="/privacy" className="text-teal-600 hover:underline">
          私隱政策
        </Link>
        。佣金比例及結算方式於審核通過後以書面協議為準。
      </p>
    </form>
  );
}
