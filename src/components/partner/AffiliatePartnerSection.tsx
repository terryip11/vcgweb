import Link from "next/link";
import AffiliateApplicationForm from "@/components/partner/AffiliateApplicationForm";
import AffiliatePageNav from "@/components/partner/AffiliatePageNav";
import PageHero from "@/components/layout/PageHero";
import {
  AFFILIATE_COMMISSION_MODELS,
  AFFILIATE_FAQ,
  AFFILIATE_HOW_IT_WORKS,
  AFFILIATE_PROMOTABLE_PAGES,
} from "@/data/affiliate-program";
import { buildReferralLink } from "@/lib/affiliate/referral";
import { getSiteUrl } from "@/lib/site";

export default function AffiliatePartnerSection() {
  const exampleLink = buildReferralLink("/compare", "YOURCODE", getSiteUrl());

  return (
    <>
      <PageHero
        badge="Affiliate 計劃"
        title="VCG 推廣夥伴計劃"
        subtitle="將您的流量與影響力變現 — 分享 VCG 貸款比較、中小企融資及政府基金資訊，每個有效查詢均可賺取佣金。"
      />

      <AffiliatePageNav />

      {/* 如何運作 */}
      <section id="how" className="scroll-mt-28 bg-slate-50 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-xl font-bold text-slate-900">如何運作？</h2>
          <p className="mt-1 text-sm text-slate-500">
            四步開始賺取推廣佣金
          </p>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {AFFILIATE_HOW_IT_WORKS.map((item) => (
              <li
                key={item.step}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
                  {item.step}
                </span>
                <h3 className="mt-3 font-bold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{item.desc}</p>
              </li>
            ))}
          </ol>

          <div className="mt-6 rounded-xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-900">
            <span className="font-semibold">專屬連結示例：</span>{" "}
            <code className="break-all text-xs">{exampleLink}</code>
          </div>
        </div>
      </section>

      {/* 佣金模式 */}
      <section id="commission" className="scroll-mt-28 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-xl font-bold text-slate-900">佣金模式</h2>
          <p className="mt-1 text-sm text-slate-500">
            香港貸款業務以 CPL 起步，CPA 適合高質量渠道
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {AFFILIATE_COMMISSION_MODELS.map((model) => (
              <article
                key={model.id}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-700">
                  {model.badge}
                </span>
                <h3 className="mt-3 text-lg font-bold text-slate-900">
                  {model.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {model.desc}
                </p>
                <p className="mt-3 text-xs text-slate-400">{model.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 可推廣內容 */}
      <section id="promote" className="scroll-mt-28 bg-slate-50 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-xl font-bold text-slate-900">可推廣內容</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {AFFILIATE_PROMOTABLE_PAGES.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-teal-200 hover:shadow-md"
              >
                <h3 className="font-bold text-slate-900">{page.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{page.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 申請 + FAQ */}
      <section id="apply" className="scroll-mt-28 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 lg:grid-cols-2">
            <AffiliateApplicationForm />

            <div>
              <h2 className="text-lg font-bold text-slate-900">常見問題</h2>
              <ul className="mt-4 space-y-4">
                {AFFILIATE_FAQ.map((item) => (
                  <li
                    key={item.q}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <p className="font-semibold text-slate-900">{item.q}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.a}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-xl border border-teal-100 bg-teal-50 p-5">
                <h3 className="text-sm font-bold text-teal-900">已是推廣夥伴？</h3>
                <p className="mt-2 text-sm text-teal-800">
                  登入後台查看點擊、查詢數及專屬連結。
                </p>
                <a
                  href="/affiliate"
                  className="mt-3 inline-flex rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-700"
                >
                  進入推廣夥伴後台 →
                </a>
              </div>

              <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                <p className="font-semibold text-slate-900">貸款機構 B2B 合作？</p>
                <p className="mt-1">
                  若您是銀行或財務公司，希望接收 VCG 轉介客戶，請見{" "}
                  <Link href="/lenders" className="font-semibold text-teal-600 hover:underline">
                    貸款機構合作
                  </Link>
                  。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
