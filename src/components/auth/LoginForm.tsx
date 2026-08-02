"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoogleSignInButton } from "@/components/auth/AuthButton";
import { createClient } from "@/lib/supabase/client";
import { translateAuthError } from "@/lib/auth-errors";

type LoginMethod = "google" | "email";
type OtpStep = "input" | "verify";

const METHODS: { id: LoginMethod; label: string }[] = [
  { id: "google", label: "Google" },
  { id: "email", label: "電郵" },
];

interface LoginFormProps {
  redirectTo?: string;
  googleEnabled?: boolean;
  emailEnabled?: boolean;
}

export default function LoginForm({
  redirectTo = "/member",
  googleEnabled = true,
  emailEnabled = true,
}: LoginFormProps) {
  const router = useRouter();
  const [method, setMethod] = useState<LoginMethod>(
    googleEnabled ? "google" : "email",
  );
  const [otpStep, setOtpStep] = useState<OtpStep>("input");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function resetOtpFlow() {
    setOtpStep("input");
    setOtp("");
    setError(null);
    setMessage(null);
  }

  function switchMethod(next: LoginMethod) {
    setMethod(next);
    resetOtpFlow();
  }

  async function sendEmailOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    if (!supabase) {
      setError("無法連接伺服器");
      setLoading(false);
      return;
    }

    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("請輸入有效的電郵地址");
      setLoading(false);
      return;
    }

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: { shouldCreateUser: true },
    });

    setLoading(false);
    if (otpError) {
      setError(translateAuthError(otpError.message));
      return;
    }

    setEmail(trimmed);
    setOtpStep("verify");
    setMessage("驗證碼已發送至您的電郵，請查收（包括垃圾郵件匣）");
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    if (!supabase) {
      setError("無法連接伺服器");
      setLoading(false);
      return;
    }

    const token = otp.trim();
    if (token.length < 6) {
      setError("請輸入 6 位驗證碼");
      setLoading(false);
      return;
    }

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    setLoading(false);
    if (verifyError) {
      setError("驗證碼不正確或已過期，請重試");
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div className="flex rounded-xl bg-slate-100 p-1">
        {METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => switchMethod(m.id)}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
              method === m.id
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {m.label}
          </button>
        ))}
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

      {!googleEnabled && method === "google" && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p className="font-semibold">Google 登入尚未設定</p>
          <p className="mt-1 text-xs leading-relaxed text-amber-800">
            請到 Supabase Dashboard → Authentication → Providers → Google
            開啟，並填入 Google Cloud OAuth Client ID / Secret。Redirect URI 須為：
          </p>
          <code className="mt-2 block break-all rounded bg-white/80 px-2 py-1 text-xs text-amber-900">
            https://fualiivimorlrfpjwgtt.supabase.co/auth/v1/callback
          </code>
          <p className="mt-2 text-xs text-amber-800">
            設定完成後刷新此頁。您可先使用「電郵」登入。
          </p>
        </div>
      )}

      {method === "google" && googleEnabled && (
        <GoogleSignInButton next={redirectTo} />
      )}

      {method === "email" && !emailEnabled && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          電郵登入尚未在 Supabase 啟用。
        </div>
      )}

      {method === "email" && emailEnabled && otpStep === "input" && (
        <form onSubmit={sendEmailOtp} className="space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="mb-1 block text-xs font-semibold text-slate-500"
            >
              電郵地址
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "發送中…" : "發送電郵驗證碼"}
          </button>
          <p className="text-center text-xs text-slate-400">
            我們會發送 6 位驗證碼到您的電郵，無需密碼
          </p>
        </form>
      )}

      {method === "email" && emailEnabled && otpStep === "verify" && (
        <form onSubmit={verifyOtp} className="space-y-4">
          <div>
            <label
              htmlFor="login-otp"
              className="mb-1 block text-xs font-semibold text-slate-500"
            >
              6 位驗證碼
            </label>
            <input
              id="login-otp"
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="000000"
              autoComplete="one-time-code"
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-lg tracking-[0.3em] outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "驗證中…" : "確認登入"}
          </button>
          <button
            type="button"
            onClick={resetOtpFlow}
            className="w-full text-sm font-medium text-slate-500 hover:text-blue-600"
          >
            ← 重新輸入電郵
          </button>
        </form>
      )}
    </div>
  );
}
