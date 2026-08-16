import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import PageShell from "@/components/layout/PageShell";
import VcgLogo from "@/components/brand/VcgLogo";
import { getAuthProviderStatus } from "@/lib/supabase/auth-settings";

export const metadata: Metadata = {
  title: "會員登入 | VCG",
  description:
    "使用 Google 或電郵登入 VCG 會員帳戶，管理貸款查詢及申請記錄。",
};

interface LoginPageProps {
  searchParams: Promise<{ next?: string; error?: string; reason?: string }>;
}

const ERROR_MESSAGES: Record<string, string> = {
  auth: "登入失敗，請重試。",
  config: "無法連接 Supabase，請檢查 .env.local 設定。",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next, error, reason } = await searchParams;
  const redirectTo = next && next.startsWith("/") ? next : "/member";
  const errorMessage =
    (error && ERROR_MESSAGES[error]) ||
    (reason ? decodeURIComponent(reason) : null);

  const providers = await getAuthProviderStatus();

  return (
    <PageShell>
      <section className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-16">
        <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <VcgLogo size="lg" markOnly />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">會員登入</h1>
            <p className="mt-2 text-sm text-slate-500">
              支援 Google 或電郵登入，首次登入自動建立帳戶
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
              {error === "auth" && !reason && (
                <p className="mt-2 text-xs text-red-600">
                  若使用 Google 登入，請確認 Supabase 已啟用 Google Provider。
                </p>
              )}
            </div>
          )}

          <LoginForm
            redirectTo={redirectTo}
            googleEnabled={providers?.google ?? false}
            emailEnabled={providers?.email ?? true}
          />

          <p className="mt-6 text-center text-xs leading-relaxed text-slate-400">
            登入即表示您同意我們的{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              私隱政策
            </Link>
            及{" "}
            <Link href="/disclaimer" className="text-blue-600 hover:underline">
              免責聲明
            </Link>
            。
            <br />
            首次登入將自動建立會員帳戶。
          </p>

          <div className="mt-6 border-t border-slate-100 pt-6 text-center">
            <Link
              href="/"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              ← 返回首頁
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
