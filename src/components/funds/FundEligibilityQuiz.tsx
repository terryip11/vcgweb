"use client";

import { useEffect, useState } from "react";
import FundLeadCaptureForm from "@/components/funds/FundLeadCaptureForm";
import {
  evaluateFundEligibility,
  FUND_QUIZ_CONFIGS,
  type FundSchemeId,
} from "@/data/fund-eligibility-questions";
import type { EligibilityAnswer } from "@/data/sme-eligibility-questions";

const ANSWER_OPTIONS: [EligibilityAnswer, string][] = [
  ["yes", "是"],
  ["no", "否"],
  ["unsure", "不確定"],
];

function ResultPanel({
  schemeId,
  result,
}: {
  schemeId: FundSchemeId;
  result: ReturnType<typeof evaluateFundEligibility>;
}) {
  const config = FUND_QUIZ_CONFIGS[schemeId];
  const tone =
    result.status === "eligible"
      ? "border-emerald-200 bg-emerald-50"
      : result.status === "partial"
        ? "border-amber-200 bg-amber-50"
        : "border-red-200 bg-red-50";

  const titleColor =
    result.status === "eligible"
      ? "text-emerald-800"
      : result.status === "partial"
        ? "text-amber-800"
        : "text-red-800";

  return (
    <div className={`rounded-2xl border p-5 sm:p-6 ${tone}`}>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {config.shortName} 初步評估結果
      </p>
      <h3 className={`text-lg font-bold sm:text-xl ${titleColor}`}>
        {result.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">
        {result.summary}
      </p>
      <p className="mt-3 text-xs text-slate-500">
        必答題符合：{result.passedCount} / {result.totalRequired}
      </p>

      {result.failedItems.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {result.failedItems.map((item) => (
            <li
              key={item}
              className="flex gap-2 text-sm text-red-700 before:shrink-0 before:content-['•']"
            >
              {item}
            </li>
          ))}
        </ul>
      )}

      {result.warnings.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {result.warnings.map((item) => (
            <li
              key={item}
              className="flex gap-2 text-sm text-amber-800 before:shrink-0 before:content-['•']"
            >
              {item}
            </li>
          ))}
        </ul>
      )}

      {(result.status === "eligible" || result.status === "partial") && (
        <FundLeadCaptureForm result={result} schemeName={config.schemeName} />
      )}

      {result.status === "not-eligible" && (
        <a
          href={`https://wa.me/85264754756?text=${encodeURIComponent(`你好，我已完成${config.shortName}資格問卷，想了解其他政府基金申請方案`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-400 sm:w-auto"
        >
          WhatsApp 免費諮詢
        </a>
      )}

      <p className="mt-5 text-xs leading-relaxed text-slate-400">
        免責聲明：本問卷僅供初步參考，不構成政府資助批核保證。最終資格及批核以
        {config.authority}為準。
      </p>
    </div>
  );
}

export default function FundEligibilityQuiz({
  schemeId,
}: {
  schemeId: FundSchemeId;
}) {
  const config = FUND_QUIZ_CONFIGS[schemeId];
  const questions = config.questions;

  const [answers, setAnswers] = useState<Record<string, EligibilityAnswer>>({});
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setAnswers({});
    setStep(0);
    setSubmitted(false);
  }, [schemeId]);

  const totalCount = questions.length;
  const current = questions[step];
  const progress = Math.round((Object.keys(answers).length / totalCount) * 100);

  const result = submitted ? evaluateFundEligibility(config, answers) : null;

  function setAnswer(id: string, value: EligibilityAnswer) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setSubmitted(false);
  }

  function goNext() {
    if (step < totalCount - 1) {
      setStep((s) => s + 1);
    } else if (Object.keys(answers).length >= totalCount) {
      setSubmitted(true);
    }
  }

  function goPrev() {
    if (submitted) {
      setSubmitted(false);
      setStep(totalCount - 1);
      return;
    }
    setStep((s) => Math.max(0, s - 1));
  }

  function handleReset() {
    setAnswers({});
    setStep(0);
    setSubmitted(false);
  }

  const canGoNext = Boolean(answers[current?.id]);
  const allAnswered = Object.keys(answers).length >= totalCount;

  if (submitted && result) {
    return (
      <div className="space-y-4">
        <ResultPanel schemeId={schemeId} result={result} />
        <button
          type="button"
          onClick={handleReset}
          className="w-full rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 sm:w-auto sm:px-6"
        >
          重新填寫問卷
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
          <span>
            第 {step + 1} / {totalCount} 題
          </span>
          <span>{progress}% 完成</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-violet-600 transition-all duration-300"
            style={{ width: `${((step + 1) / totalCount) * 100}%` }}
          />
        </div>
      </div>

      <fieldset className="flex flex-1 flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
        <legend className="mb-2 text-base font-bold leading-snug text-slate-900 sm:text-lg">
          {current.question}
          {current.required && (
            <span className="ml-1 text-red-500" aria-label="必答">
              *
            </span>
          )}
        </legend>
        {current.hint && (
          <p className="mb-5 text-sm leading-relaxed text-slate-500">
            {current.hint}
          </p>
        )}

        <div className="grid gap-2 sm:grid-cols-3">
          {ANSWER_OPTIONS.map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setAnswer(current.id, value)}
              className={`rounded-xl px-4 py-3.5 text-sm font-semibold transition ${
                answers[current.id] === value
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                  : "bg-slate-50 text-slate-700 ring-1 ring-slate-200 hover:ring-violet-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={goPrev}
          disabled={step === 0}
          className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          上一題
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={!canGoNext}
          className="flex-1 rounded-xl bg-violet-600 py-3 text-sm font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {step < totalCount - 1 ? "下一題" : "查看評估結果"}
        </button>
      </div>

      {allAnswered && step < totalCount - 1 && (
        <button
          type="button"
          onClick={() => setSubmitted(true)}
          className="mt-2 text-center text-xs font-medium text-violet-600 hover:underline"
        >
          跳至結果
        </button>
      )}
    </div>
  );
}
