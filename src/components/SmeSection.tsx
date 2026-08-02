"use client";

import Link from "next/link";
import { useState } from "react";
import SmeEligibilityQuiz from "@/components/sme/SmeEligibilityQuiz";
import SmePageNav from "@/components/sme/SmePageNav";
import { endedSmeSchemes, smeSchemes } from "@/data/sme-schemes";
import type { Product } from "@/types";

const scheme = smeSchemes[0];

function StatPill({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
      <p className="text-xs text-blue-200">{label}</p>
      <p
        className={`mt-0.5 text-sm font-bold sm:text-base ${accent ? "text-amber-300" : "text-white"}`}
      >
        {value}
      </p>
    </div>
  );
}

function EndedSchemeCard({
  name,
  maxAmount,
  maxTerm,
  interestRate,
  deadline,
}: {
  name: string;
  maxAmount: string;
  maxTerm: string;
  interestRate: string;
  deadline?: string;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-slate-700">{name}</h3>
        <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
          已完結
        </span>
      </div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <div>
          <dt className="text-slate-400">最高貸款額</dt>
          <dd className="font-semibold text-slate-700">{maxAmount}</dd>
        </div>
        <div>
          <dt className="text-slate-400">最長年期</dt>
          <dd className="font-semibold text-slate-700">{maxTerm}</dd>
        </div>
        <div>
          <dt className="text-slate-400">年利率</dt>
          <dd className="font-semibold text-slate-700">{interestRate}</dd>
        </div>
        {deadline && (
          <div>
            <dt className="text-slate-400">申請期</dt>
            <dd className="font-semibold text-slate-700">至 {deadline}</dd>
          </div>
        )}
      </dl>
    </article>
  );
}

interface SmeSectionProps {
  alternativeProducts?: Product[];
}

export default function SmeSection({
  alternativeProducts = [],
}: SmeSectionProps) {
  const [showEnded, setShowEnded] = useState(false);

  return (
    <>
      <SmePageNav />

      {/* 計劃概覽 */}
      <section id="overview" className="scroll-mt-14 bg-slate-50 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c2340] via-[#123a6b] to-[#1a5080] shadow-xl">
            <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-2 lg:gap-8 lg:p-10">
              {/* 左：計劃介紹 */}
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                    申請中
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-100">
                    政府 80% 信貸擔保
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  {scheme.name}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-blue-100 sm:text-base">
                  由香港按證保險有限公司提供信貸擔保，協助本地中小企從參與計劃的貸款機構取得融資。VCG
                  協助文件準備及申請跟進。
                </p>

                {scheme.highlights && scheme.highlights.length > 0 && (
                  <ul className="mt-4 space-y-2 rounded-xl bg-white/10 p-4">
                    {scheme.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-xs leading-relaxed text-blue-100 sm:text-sm"
                      >
                        <span className="shrink-0 text-emerald-300">✦</span>
                        {item}
                      </li>
                    ))}
                    <li className="pt-1 text-xs text-blue-200/80">
                      資料來源：{" "}
                      <a
                        href="https://www.hkma.gov.hk/chi/news-and-media/press-releases/2025/09/20250917-4/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-white"
                      >
                        金管局 2025 年 9 月 17 日新聞稿
                      </a>
                    </li>
                  </ul>
                )}

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <StatPill label="最高貸款額" value={scheme.maxAmount} />
                  <StatPill label="最長擔保期" value={scheme.maxTerm} />
                  <StatPill label="參考年利率" value={scheme.interestRate} />
                  <StatPill
                    label="申請期"
                    value={`至 ${scheme.deadline}`}
                    accent
                  />
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#quiz"
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById("quiz")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-900 transition hover:bg-blue-50"
                  >
                    開始資格評估
                  </a>
                  <a
                    href="https://wa.me/85264754756?text=你好，我想查詢政府八成信貸擔保計劃"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-xl border border-white/30 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    WhatsApp 諮詢
                  </a>
                </div>
              </div>

              {/* 右：申請條件 */}
              <div className="rounded-2xl bg-white/95 p-5 backdrop-blur sm:p-6">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">
                  主要申請條件
                </h3>
                <ul className="space-y-3">
                  {scheme.requirements.map((req) => (
                    <li
                      key={req}
                      className="flex gap-3 text-sm leading-relaxed text-slate-700"
                    >
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs text-emerald-600"
                        aria-hidden
                      >
                        ✓
                      </span>
                      {req}
                    </li>
                  ))}
                </ul>
                <a
                  href="https://www.hkmc.com.hk/chi/our_business/sme_financing_guarantee_scheme.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex text-xs font-medium text-blue-600 hover:underline"
                >
                  查看官方計劃詳情 →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 資格問卷 — 桌面雙欄 */}
      <section id="quiz" className="scroll-mt-14 border-t border-slate-100 bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 lg:mb-10">
            <span className="mb-2 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              免費評估 · 約 2 分鐘
            </span>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              八成信貸擔保資格問卷
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
              逐步回答 10 道問題，即時了解您的企業是否符合八成信貸擔保產品的申請方向。
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
            {/* 左側固定提示（桌面） */}
            <aside className="hidden lg:col-span-2 lg:block">
              <div className="sticky top-20 space-y-4">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <h3 className="mb-3 text-sm font-bold text-slate-900">
                    評估提示
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex gap-2">
                      <span className="text-blue-500">•</span>
                      標有 * 為必答題，須全部符合才可申請
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-500">•</span>
                      選「不確定」會列為待確認項目
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-500">•</span>
                      可點擊題號跳至任意題目
                    </li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
                  <p className="text-xs font-semibold text-amber-800">
                    慎防詐騙
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-amber-700">
                    按證保險公司呼籲勿委任不明第三方代辦。請透過參與計劃的貸款機構申請，VCG
                    為配對平台，協助對接。
                  </p>
                </div>
              </div>
            </aside>

            {/* 問卷主體 */}
            <div className="lg:col-span-3">
              <SmeEligibilityQuiz />
            </div>
          </div>
        </div>
      </section>

      {/* 商業貸款配對 */}
      {alternativeProducts.length > 0 && (
        <section
          id="alternatives"
          className="scroll-mt-14 border-t border-slate-100 bg-slate-50 py-10 sm:py-14"
        >
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="mb-2 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  商業貸款配對
                </span>
                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  中小企商業貸款方案
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  政府擔保計劃以外，VCG 亦可配對銀行及財務公司中小企貸款。
                </p>
              </div>
              <Link
                href="/compare?category=sme"
                className="inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-600"
              >
                查看全部 →
              </Link>
            </div>

            {/* 手機：橫向滑動；桌面：網格 */}
            <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
              {alternativeProducts.map((product) => (
                <article
                  key={product.id}
                  className="flex w-[min(85vw,320px)] shrink-0 flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:w-auto"
                >
                  <h3 className="font-bold text-slate-900">{product.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                    {product.tagline}
                  </p>
                  <div className="mt-4 flex gap-6">
                    <div>
                      <p className="text-xs text-slate-400">APR</p>
                      <p className="text-lg font-bold text-blue-600">
                        {product.apr}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">最高貸款額</p>
                      <p className="text-sm font-semibold text-slate-800">
                        HK${product.maxAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <a
                    href="https://wa.me/85264754756?text=你好，我想查詢中小企貸款"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto pt-4 inline-flex items-center justify-center rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-amber-400"
                  >
                    立即查詢
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 已完結計劃 — 可摺疊 */}
      {endedSmeSchemes.length > 0 && (
        <section className="border-t border-slate-200 bg-slate-100/60 py-8 sm:py-10">
          <div className="mx-auto max-w-6xl px-4">
            <button
              type="button"
              onClick={() => setShowEnded((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl bg-white px-5 py-4 text-left shadow-sm transition hover:shadow-md"
              aria-expanded={showEnded}
            >
              <div>
                <h2 className="text-base font-bold text-slate-700 sm:text-lg">
                  已完結計劃（僅供參考）
                </h2>
                <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                  九成及百分百擔保計劃已停止接受新申請
                </p>
              </div>
              <span
                className={`ml-4 shrink-0 text-slate-400 transition-transform ${showEnded ? "rotate-180" : ""}`}
                aria-hidden
              >
                ▼
              </span>
            </button>

            {showEnded && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {endedSmeSchemes.map((s) => (
                  <EndedSchemeCard key={s.id} {...s} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
