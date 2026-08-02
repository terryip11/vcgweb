import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";

export const metadata: Metadata = {
  title: "無法使用 | VCG 推廣夥伴",
};

export default function AffiliateUnavailablePage() {
  return (
    <PageShell>
      <PageHero
        badge="推廣夥伴"
        title="帳戶暫不可用"
        subtitle="您的推廣夥伴申請未獲批准或已被暫停。"
      />
      <section className="py-12">
        <div className="mx-auto max-w-lg px-4 text-center">
          <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
            <p className="text-sm text-slate-600">
              如有疑問，請 WhatsApp 聯絡 VCG，或重新提交申請。
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href="https://wa.me/85264754756?text=你好，我想查詢推廣夥伴帳戶狀態"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
              >
                WhatsApp 聯絡
              </a>
              <Link
                href="/partner"
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                返回推廣計劃
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
