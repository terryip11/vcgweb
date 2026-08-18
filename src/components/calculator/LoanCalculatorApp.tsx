"use client";

import { useEffect, useMemo, useState } from "react";
import BankSelect from "@/components/calculator/BankSelect";
import CalculatorWhatsAppShare from "@/components/calculator/CalculatorWhatsAppShare";
import CategorySelect from "@/components/calculator/CategorySelect";
import {
  calcDsr,
  calcEffectivePropertyValuation,
  calcRevolvingLoan,
  calcStressExtraPayment,
  calcTermLoan,
  emptyProperty,
  emptyRevolvingLoan,
  emptyTermLoan,
  formatAprPercent,
  formatHKD,
  formatMonthlyFlatPercent,
  formatPercent,
  REVOLVING_RATES,
  type PropertyStressInput,
  type RevolvingLoanInput,
  type TermLoanInput,
} from "@/lib/loan-calculator";

function formatNumberDisplay(
  value: number | null,
  showZero: boolean,
) {
  if (value === null || !Number.isFinite(value)) return "";
  if (value === 0 && !showZero) return "";
  return String(value);
}

function NumberInput({
  label,
  value,
  onChange,
  step = 1,
  min = 0,
  suffix,
  showZero = false,
  nullable = false,
}: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
  step?: number;
  min?: number;
  suffix?: string;
  /** 為 true 時，值為 0 仍顯示「0」 */
  showZero?: boolean;
  /** 為 true 時，清空欄位代表 null（未填寫） */
  nullable?: boolean;
}) {
  const [text, setText] = useState(() =>
    formatNumberDisplay(value, showZero),
  );
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) {
      setText(formatNumberDisplay(value, showZero));
    }
  }, [value, showZero, focused]);

  function commitEmpty() {
    onChange(nullable ? null : 0);
  }

  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-500">
        {label}
      </span>
      <div className="relative">
        <input
          type="number"
          min={min}
          step={step}
          value={focused ? text : formatNumberDisplay(value, showZero)}
          onFocus={() => {
            setFocused(true);
            setText(formatNumberDisplay(value, showZero));
          }}
          onBlur={() => {
            setFocused(false);
            if (text === "") {
              commitEmpty();
              return;
            }
            const num = Number(text);
            onChange(Number.isFinite(num) ? num : nullable ? null : 0);
          }}
          onChange={(e) => {
            const raw = e.target.value;
            setText(raw);
            if (raw === "") {
              commitEmpty();
              return;
            }
            const num = Number(raw);
            if (Number.isFinite(num)) onChange(num);
          }}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

function TextInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-500">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

function ResultCell({
  label,
  sublabel,
  value,
  highlight,
  warn,
}: {
  label: string;
  sublabel?: string;
  value: string;
  highlight?: boolean;
  warn?: boolean;
}) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2">
      <p className="text-xs text-slate-400">{label}</p>
      {sublabel && (
        <p className="text-[11px] leading-tight text-slate-400">{sublabel}</p>
      )}
      <p
        className={`text-sm font-semibold ${
          warn ? "text-red-600" : highlight ? "text-blue-600" : "text-slate-800"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
    </div>
  );
}

export default function LoanCalculatorApp() {
  const [termLoans, setTermLoans] = useState<TermLoanInput[]>([
    emptyTermLoan(),
  ]);
  const [revolvingLoans, setRevolvingLoans] = useState<RevolvingLoanInput[]>(
    [],
  );
  const [property, setProperty] = useState<PropertyStressInput>(emptyProperty());
  const [monthlyIncome, setMonthlyIncome] = useState(0);

  const termResults = useMemo(
    () => termLoans.map((l) => ({ loan: l, result: calcTermLoan(l) })),
    [termLoans],
  );

  const revolvingResults = useMemo(
    () =>
      revolvingLoans.map((l) => ({ loan: l, result: calcRevolvingLoan(l) })),
    [revolvingLoans],
  );

  const totals = useMemo(() => {
    const termPrincipal = termLoans.reduce((s, l) => s + l.principal, 0);
    const termMonthly = termLoans.reduce((s, l) => s + l.monthlyPayment, 0);
    const termOutstanding = termResults.reduce(
      (s, r) => s + (r.result?.outstanding ?? 0),
      0,
    );
    const revPrincipal = revolvingLoans.reduce((s, l) => s + l.principal, 0);
    const revMonthly = revolvingResults.reduce(
      (s, r) => s + (r.result?.monthlyPayment ?? 0),
      0,
    );
    const revOutstanding = revolvingLoans.reduce(
      (s, l) => s + l.outstanding,
      0,
    );

    return {
      totalPrincipal: termPrincipal + revPrincipal,
      totalMonthly: termMonthly + revMonthly,
      totalOutstanding: termOutstanding + revOutstanding,
    };
  }, [termLoans, termResults, revolvingLoans, revolvingResults]);

  const stressExtra = calcStressExtraPayment(
    property.mortgageMonthly,
    property.ltvRatio,
  );

  const effectiveValuation = calcEffectivePropertyValuation(
    property.propertyValuation,
    property.ownershipRatio,
  );

  const dsr = calcDsr({
    loanMonthlyPayment: totals.totalMonthly,
    mortgageMonthly: property.mortgageMonthly,
    rent: property.rent,
    stressExtraPayment: stressExtra,
    totalOutstanding: totals.totalOutstanding,
    monthlyIncome,
  });

  const dsrTotalMonthly =
    totals.totalMonthly +
    property.mortgageMonthly +
    property.rent +
    stressExtra;

  function updateTermLoan(id: string, patch: Partial<TermLoanInput>) {
    setTermLoans((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    );
  }

  function updateRevolving(id: string, patch: Partial<RevolvingLoanInput>) {
    setRevolvingLoans((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
        <div className="bg-gradient-to-br from-[#0c2340] to-[#1a5080] px-4 py-10 text-white">
          <div className="mx-auto max-w-6xl">
            <h1 className="text-2xl font-bold sm:text-3xl">VCG 貸款計算機</h1>
            <p className="mt-2 max-w-2xl text-sm text-blue-100 sm:text-base">
              參考 Excel
              試算表邏輯，計算現有貸款月供、月平息、APR、DSR
              供款比率及物業壓力測試。
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
          {/* Section 1: Term loans */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionTitle
              title="① 分期貸款"
              subtitle="輸入貸款金額、月供、已還期數及總期數，自動計算欠款、月平息及 APR"
            />

            {termLoans.length === 0 ? (
              <p className="mb-4 text-sm text-slate-400">尚未新增分期貸款</p>
            ) : (
            <div className="space-y-4">
              {termResults.map(({ loan, result }, idx) => (
                <div
                  key={loan.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">
                      貸款 #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setTermLoans((p) => p.filter((l) => l.id !== loan.id))
                      }
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      移除
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <BankSelect
                      bank={loan.bank}
                      bankOther={loan.bankOther}
                      onChange={(bank, bankOther) =>
                        updateTermLoan(loan.id, { bank, bankOther })
                      }
                    />
                    <CategorySelect
                      variant="term"
                      category={loan.category}
                      categoryOther={loan.categoryOther}
                      onChange={(category, categoryOther) =>
                        updateTermLoan(loan.id, { category, categoryOther })
                      }
                    />
                    <NumberInput
                      label="貸款金額"
                      value={loan.principal}
                      onChange={(v) =>
                        updateTermLoan(loan.id, { principal: v ?? 0 })
                      }
                      step={1000}
                    />
                    <NumberInput
                      label="月供"
                      value={loan.monthlyPayment}
                      onChange={(v) =>
                        updateTermLoan(loan.id, { monthlyPayment: v ?? 0 })
                      }
                      step={100}
                    />
                    <NumberInput
                      label="已還期數"
                      value={loan.paidPeriods}
                      onChange={(v) =>
                        updateTermLoan(loan.id, { paidPeriods: v })
                      }
                      nullable
                      showZero
                    />
                    <NumberInput
                      label="總期數"
                      value={loan.totalPeriods}
                      onChange={(v) =>
                        updateTermLoan(loan.id, { totalPeriods: v ?? 0 })
                      }
                    />
                  </div>

                  {result && (
                    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                      <ResultCell
                        label="欠款金額"
                        sublabel="(剩餘期數×月供)"
                        value={formatHKD(result.outstanding, 2)}
                        highlight
                      />
                      <ResultCell
                        label="月平息"
                        value={formatMonthlyFlatPercent(result.monthlyFlat)}
                      />
                      <ResultCell
                        label="APR"
                        value={formatAprPercent(result.apr)}
                      />
                      <ResultCell
                        label="利息部分"
                        value={formatHKD(result.interestPortion, 2)}
                      />
                      <ResultCell
                        label="本金部分"
                        value={formatHKD(result.principalPortion, 2)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            )}

            <button
              type="button"
              onClick={() =>
                setTermLoans((p) => [...p, emptyTermLoan()])
              }
              className="mt-4 rounded-lg border border-dashed border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:border-blue-400 hover:text-blue-600"
            >
              + 新增分期貸款
            </button>
          </section>

          {/* Section 2: Revolving */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionTitle
              title="② 循環 / 卡數貸款"
              subtitle={`月供 = 欠款 × 利率（Card / 循環借貸 預設 ${(REVOLVING_RATES.Card * 100).toFixed(1)}%）`}
            />

            {revolvingLoans.length === 0 ? (
              <p className="mb-4 text-sm text-slate-400">尚未新增循環貸款</p>
            ) : (
              <div className="space-y-4">
                {revolvingResults.map(({ loan, result }, idx) => (
                  <div
                    key={loan.id}
                    className="rounded-xl border border-slate-100 bg-slate-50/50 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400">
                        循環 #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setRevolvingLoans((p) =>
                            p.filter((l) => l.id !== loan.id),
                          )
                        }
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        移除
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <BankSelect
                        bank={loan.bank}
                        bankOther={loan.bankOther}
                        onChange={(bank, bankOther) =>
                          updateRevolving(loan.id, { bank, bankOther })
                        }
                      />
                      <CategorySelect
                        variant="revolving"
                        category={loan.category}
                        categoryOther={loan.categoryOther}
                        customRate={loan.customRate}
                        onChange={(category, categoryOther, customRate) =>
                          updateRevolving(loan.id, {
                            category,
                            categoryOther,
                            customRate,
                          })
                        }
                      />
                      <NumberInput
                        label="本金額"
                        value={loan.principal}
                        onChange={(v) =>
                          updateRevolving(loan.id, { principal: v ?? 0 })
                        }
                        step={1000}
                      />
                      <NumberInput
                        label="欠款金額"
                        value={loan.outstanding}
                        onChange={(v) =>
                          updateRevolving(loan.id, { outstanding: v ?? 0 })
                        }
                        step={1000}
                      />
                      <NumberInput
                        label="總期數"
                        value={loan.totalPeriods}
                        onChange={(v) =>
                          updateRevolving(loan.id, { totalPeriods: v ?? 0 })
                        }
                      />
                    </div>

                    {result && (
                      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                        <ResultCell
                          label="月供（自動）"
                          value={formatHKD(result.monthlyPayment, 2)}
                          highlight
                        />
                        <ResultCell
                          label="月平息"
                          value={formatMonthlyFlatPercent(result.monthlyFlat)}
                        />
                        <ResultCell
                          label="APR"
                          value={formatAprPercent(result.apr)}
                        />
                        <ResultCell
                          label="利息部分"
                          value={formatHKD(result.interestPortion, 2)}
                        />
                        <ResultCell
                          label="本金部分"
                          value={formatHKD(result.principalPortion, 2)}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() =>
                setRevolvingLoans((p) => [...p, emptyRevolvingLoan()])
              }
              className="mt-4 rounded-lg border border-dashed border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:border-blue-400 hover:text-blue-600"
            >
              + 新增循環貸款
            </button>
          </section>

          {/* Summary */}
          <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:p-6">
            <SectionTitle title="③ 貸款匯總" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <ResultCell
                label="總貸款金額"
                value={formatHKD(totals.totalPrincipal, 2)}
                highlight
              />
              <ResultCell
                label="總月供"
                value={formatHKD(totals.totalMonthly, 2)}
                highlight
              />
              <ResultCell
                label="總欠款金額"
                value={formatHKD(totals.totalOutstanding, 2)}
                highlight
              />
            </div>
          </section>

          {/* Property stress test */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionTitle
              title="④ 物業壓力測試"
              subtitle="輸入物業估價、業權比率及按揭資料，計算加息壓力下的額外月供"
            />

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <TextInput
                label="物業名稱"
                value={property.name}
                onChange={(v) => setProperty((p) => ({ ...p, name: v }))}
              />
              <NumberInput
                label="物業估價"
                value={property.propertyValuation}
                onChange={(v) =>
                  setProperty((p) => ({ ...p, propertyValuation: v ?? 0 }))
                }
                step={100000}
              />
              <NumberInput
                label="業權比率"
                value={+(property.ownershipRatio * 100).toFixed(4)}
                onChange={(v) =>
                  setProperty((p) => ({
                    ...p,
                    ownershipRatio: Math.min(100, Math.max(0, (v ?? 0) / 100)),
                  }))
                }
                step={0.01}
                suffix="%"
              />
              <NumberInput
                label="按揭金額"
                value={property.mortgageAmount}
                onChange={(v) =>
                  setProperty((p) => ({ ...p, mortgageAmount: v ?? 0 }))
                }
                step={100000}
              />
              <NumberInput
                label="按揭月供"
                value={property.mortgageMonthly}
                onChange={(v) =>
                  setProperty((p) => ({ ...p, mortgageMonthly: v ?? 0 }))
                }
                step={500}
              />
              <NumberInput
                label="按揭期數（月）"
                value={property.totalPeriods}
                onChange={(v) =>
                  setProperty((p) => ({ ...p, totalPeriods: v ?? 0 }))
                }
              />
              <NumberInput
                label="租金"
                value={property.rent}
                onChange={(v) => setProperty((p) => ({ ...p, rent: v ?? 0 }))}
                step={500}
              />
              <NumberInput
                label="按揭成數 / 壓力比例"
                value={+(property.ltvRatio * 100).toFixed(4)}
                onChange={(v) =>
                  setProperty((p) => ({ ...p, ltvRatio: (v ?? 0) / 100 }))
                }
                step={0.01}
                suffix="%"
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <ResultCell
                label="有效物業估價"
                sublabel="物業估價 × 業權比率"
                value={formatHKD(effectiveValuation, 2)}
                highlight
              />
              <ResultCell
                label="壓力測試額外月供"
                value={formatHKD(stressExtra, 2)}
                highlight
              />
              <ResultCell
                label="按揭成數"
                value={formatPercent(
                  effectiveValuation > 0
                    ? property.mortgageAmount / effectiveValuation
                    : 0,
                  2,
                )}
              />
              <ResultCell
                label="公式"
                value={`${formatHKD(property.mortgageMonthly, 2)} × ${formatPercent(property.ltvRatio, 2)}`}
              />
            </div>
          </section>

          {/* DSR */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionTitle
              title="⑤ DSR 供款比率評估"
              subtitle="DSR = (總月供 + 按揭月供 + 租金 + 壓力額外月供) ÷ 月收入"
            />

            <div className="mb-4 max-w-xs">
              <NumberInput
                label="月收入（未扣 MPF）"
                value={monthlyIncome}
                onChange={(v) => setMonthlyIncome(v ?? 0)}
                step={1000}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-100 p-4">
                <h3 className="mb-3 font-bold text-slate-800">私人貸款</h3>
                <div className="grid grid-cols-2 gap-2">
                  <ResultCell
                    label="DSR 現有比率"
                    value={formatPercent(dsr.currentDsr, 2)}
                    warn={dsr.currentDsr > dsr.privateDsrLimit}
                  />
                  <ResultCell
                    label="DSR 上限 (<70%)"
                    value={formatPercent(dsr.privateDsrLimit)}
                  />
                  <ResultCell
                    label="DSR 上限金額"
                    value={formatHKD(dsr.privateDsrMaxPayment, 2)}
                  />
                  <ResultCell
                    label="UCE 比率 (<20x)"
                    value={`${dsr.uceRatio.toFixed(2)}x`}
                    warn={dsr.uceRatio > 20}
                  />
                  <ResultCell
                    label="UCE 上限金額"
                    value={formatHKD(dsr.uceLimit, 2)}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 p-4">
                <h3 className="mb-3 font-bold text-slate-800">按揭貸款</h3>
                <div className="grid grid-cols-2 gap-2">
                  <ResultCell
                    label="DSR 現有比率"
                    value={formatPercent(dsr.currentDsr, 2)}
                    warn={dsr.currentDsr > dsr.mortgageDsrLimit}
                  />
                  <ResultCell
                    label="DSR 上限 (<80%)"
                    value={formatPercent(dsr.mortgageDsrLimit)}
                  />
                  <ResultCell
                    label="DSR 上限金額"
                    value={formatHKD(dsr.mortgageDsrMaxPayment, 2)}
                  />
                  <ResultCell
                    label="UCE 上限 (<30x)"
                    value={formatHKD(dsr.uceLimitMortgage, 2)}
                  />
                  <ResultCell
                    label="D/A 按揭資產/年"
                    value={formatHKD(dsr.mortgageRemainingCapacity, 2)}
                  />
                  <ResultCell
                    label="DSR 剩餘資金/月"
                    value={formatHKD(dsr.remainingIncomeAfterDsr, 2)}
                    highlight
                  />
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              DSR = (總月供 {formatHKD(totals.totalMonthly, 2)} + 按揭月供{" "}
              {formatHKD(property.mortgageMonthly, 2)} + 租金{" "}
              {formatHKD(property.rent, 2)} + 壓力額外月供{" "}
              {formatHKD(stressExtra, 2)}) ÷ 月收入{" "}
              {formatHKD(monthlyIncome, 2)} = {formatHKD(dsrTotalMonthly, 2)} ÷{" "}
              {formatHKD(monthlyIncome, 2)} = {formatPercent(dsr.currentDsr, 2)}
            </p>
          </section>

          <CalculatorWhatsAppShare
            input={{
              termResults,
              revolvingResults,
              totals,
              property,
              stressExtra,
              effectiveValuation,
              monthlyIncome,
              dsr,
            }}
          />

          <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs leading-relaxed text-slate-400">
            免責聲明：本計算機僅供參考，計算邏輯参照內部 Excel
            試算表。實際利率、批核結果及 DSR
            要求以金融機構及監管規定為準，不構成財務建議。
          </div>
        </div>
      </div>
  );
}
