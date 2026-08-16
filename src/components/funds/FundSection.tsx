"use client";

import Link from "next/link";
import { useState } from "react";
import FundEligibilityQuiz from "@/components/funds/FundEligibilityQuiz";
import FundPageNav from "@/components/funds/FundPageNav";
import PageHero from "@/components/layout/PageHero";
import {
  FUND_QUIZ_CONFIGS,
  FUND_QUIZ_SCHEME_ORDER,
  type FundSchemeId,
} from "@/data/fund-eligibility-questions";
import {
  FUND_APPLICATION_STEPS,
  fundingSchemes,
  type FundingScheme,
} from "@/data/funding-schemes";

function scrollToQuiz(schemeId: FundSchemeId, setActiveQuiz: (id: FundSchemeId) => void) {
  setActiveQuiz(schemeId);
  document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function SchemeCard({
  scheme,
  onQuizClick,
}: {
  scheme: FundingScheme;
  onQuizClick: (id: FundSchemeId) => void;
}) {
  const statusLabel =
    scheme.status === "ongoing" ? "全年接受" : scheme.status === "active" ? "申請中" : "已完結";

  return (
    <article className="flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:border-violet-200 hover:shadow-md">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700">
          {scheme.shortName}
        </span>
        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
          {statusLabel}
        </span>
      </div>

      <h3 className="text-lg font-bold text-slate-900">{scheme.name}</h3>
      <p className="mt-1 text-xs text-slate-500">{scheme.provider}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
        {scheme.summary}
      </p>

      <dl className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 text-xs">
        <div>
          <dt className="text-slate-400">最高資助</dt>
          <dd className="mt-0.5 font-bold text-slate-800">{scheme.maxFunding}</dd>
        </div>
        {scheme.fundingRatio && (
          <div>
            <dt className="text-slate-400">資助比例</dt>
            <dd className="mt-0.5 font-bold text-slate-800">{scheme.fundingRatio}</dd>
          </div>
        )}
      </dl>

      {scheme.highlights.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {scheme.highlights.slice(0, 2).map((item) => (
            <li
              key={item}
              className="flex gap-2 text-xs text-slate-600 before:shrink-0 before:text-violet-500 before:content-['✓']"
            >
              {item}
            </li>
          ))}
        </ul>
      )}

      {scheme.applyUrl && (
        <a
          href={scheme.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex text-sm font-semibold text-violet-600 hover:underline"
        >
          官方計劃詳情 →
        </a>
      )}

      <button
        type="button"
        onClick={() => onQuizClick(scheme.id as FundSchemeId)}
        className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"
      >
        自測 {scheme.shortName} 資格
      </button>
    </article>
  );
}

export default function FundSection() {
  const featured = fundingSchemes.find((s) => s.id === "ess")!;
  const [activeQuiz, setActiveQuiz] = useState<FundSchemeId>("ess");
  const quizConfig = FUND_QUIZ_CONFIGS[activeQuiz];

  return (
    <>
      <PageHero
        badge="政府資助"
        title="基金申請"
        subtitle="VCG 協助本地企業申請政府資助計劃，包括 ESS 研發資助、BUD 專項基金及 EMF 市場推廣基金，提供資格評估及申請策劃。"
      />

      <FundPageNav />

      {/* 重點計劃 ESS */}
      <section id="schemes" className="scroll-mt-28 bg-slate-50 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-[#2e1065] via-[#5b21b6] to-[#7c3aed] shadow-xl">
            <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-2 lg:p-10">
              <div>
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-200">
                    全年接受申請
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-violet-100">
                    2026–27 年度
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  {featured.name}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-violet-100 sm:text-base">
                  {featured.summary}
                </p>
                <ul className="mt-4 space-y-2">
                  {featured.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2 text-sm text-violet-100 before:content-['✓']"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur sm:p-6">
                <h3 className="text-sm font-bold text-white">申請資格摘要</h3>
                <ul className="mt-3 space-y-2">
                  {featured.requirements.map((req) => (
                    <li
                      key={req}
                      className="flex gap-2 text-sm text-violet-100 before:shrink-0 before:content-['•']"
                    >
                      {req}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => scrollToQuiz("ess", setActiveQuiz)}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-violet-700 transition hover:bg-violet-50 sm:w-auto"
                >
                  立即自測 ESS 資格
                </button>
              </div>
            </div>
          </div>

          <h2 className="mb-2 text-xl font-bold text-slate-900">其他政府基金</h2>
          <p className="mb-6 text-sm text-slate-500">
            VCG 可協助評估及策劃以下常見政府資助計劃
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fundingSchemes
              .filter((s) => s.id !== "ess")
              .map((scheme) => (
                <SchemeCard
                  key={scheme.id}
                  scheme={scheme}
                  onQuizClick={(id) => scrollToQuiz(id, setActiveQuiz)}
                />
              ))}
          </div>
        </div>
      </section>

      {/* 申請流程 */}
      <section id="process" className="scroll-mt-28 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-xl font-bold text-slate-900">一般申請流程</h2>
          <p className="mt-1 text-sm text-slate-500">
            以 ESS 為例，各計劃步驟可能略有不同
          </p>

          <ol className="mt-8 grid gap-4 sm:grid-cols-5">
            {FUND_APPLICATION_STEPS.map((item) => (
              <li
                key={item.step}
                className="relative rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
                  {item.step}
                </span>
                <h3 className="mt-3 text-sm font-bold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{item.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 資格問卷 */}
      <section id="quiz" className="scroll-mt-28 bg-slate-50 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900">政府基金資格自測</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              選擇計劃後快速評估初步資格。完成問卷可留下聯絡方式，VCG 顧問免費跟進。
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {FUND_QUIZ_SCHEME_ORDER.map((id) => {
                const cfg = FUND_QUIZ_CONFIGS[id];
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveQuiz(id)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      activeQuiz === id
                        ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                        : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-violet-300"
                    }`}
                  >
                    {cfg.shortName}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {quizConfig.schemeName} 問卷
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {quizConfig.questions.length} 題快速評估是否初步符合
                {quizConfig.shortName} 要求。
              </p>
              <div className="mt-6 rounded-2xl border border-violet-100 bg-violet-50 p-5">
                <h4 className="text-sm font-bold text-violet-900">所需文件參考</h4>
                <ul className="mt-3 space-y-1.5 text-sm text-violet-800">
                  {quizConfig.documentChecklist.map((item) => (
                    <li key={item}>· {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <FundEligibilityQuiz schemeId={activeQuiz} />
          </div>
        </div>
      </section>

      {/* VCG 協助 */}
      <section id="contact" className="scroll-mt-28 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">VCG 基金申請協助</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  VCG 協助企業評估政府資助資格、整理申請文件及策劃項目方向。我們亦提供貸款配對及中小企融資方案，一站式滿足您的資金需求。
                </p>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  <li>✓ 免費初步資格評估</li>
                  <li>✓ 申請文件清單及方向建議</li>
                  <li>✓ 配合貸款及融資方案配對</li>
                </ul>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <a
                  href="https://wa.me/85264754756?text=你好，我想查詢政府基金申請"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-400"
                >
                  WhatsApp 免費諮詢
                </a>
                <Link
                  href="/sme"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  了解中小企融資 →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
