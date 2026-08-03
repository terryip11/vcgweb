/** Excel-compatible financial calculations for VCG loan calculator */

import { getRevolvingRate, REVOLVING_RATES } from "@/data/loan-categories";

export { REVOLVING_RATES };

export interface TermLoanInput {
  id: string;
  bank: string;
  bankOther?: string;
  category: string;
  categoryOther?: string;
  principal: number;
  monthlyPayment: number;
  paidPeriods: number | null;
  totalPeriods: number;
}

export interface TermLoanResult {
  outstanding: number;
  monthlyFlat: number;
  apr: number;
  annualRate: number;
  interestPortion: number;
  principalPortion: number;
}

export interface RevolvingLoanInput {
  id: string;
  bank: string;
  bankOther?: string;
  category: keyof typeof REVOLVING_RATES | string;
  categoryOther?: string;
  customRate?: number;
  principal: number;
  outstanding: number;
  totalPeriods: number;
}

export interface RevolvingLoanResult {
  monthlyPayment: number;
  monthlyFlat: number;
  apr: number;
  annualRate: number;
  interestPortion: number;
  principalPortion: number;
}

export interface PropertyStressInput {
  name: string;
  propertyValuation: number;
  mortgageAmount: number;
  mortgageMonthly: number;
  remainingPeriods: number;
  totalPeriods: number;
  rent: number;
  ltvRatio: number;
  /** 業權比率 0–1，用於計算此物業估價所佔比例 */
  ownershipRatio: number;
}

export interface DsrInput {
  loanMonthlyPayment: number;
  mortgageMonthly: number;
  rent: number;
  stressExtraPayment: number;
  totalOutstanding: number;
  monthlyIncome: number;
}

export interface DsrResult {
  currentDsr: number;
  privateDsrLimit: number;
  privateDsrMaxPayment: number;
  uceRatio: number;
  uceLimit: number;
  mortgageDsrLimit: number;
  mortgageDsrMaxPayment: number;
  uceLimitMortgage: number;
  remainingIncomeAfterDsr: number;
  mortgageRemainingCapacity: number;
}

/** Excel RATE function — Newton-Raphson iteration */
export function rate(
  nper: number,
  pmt: number,
  pv: number,
  fv = 0,
  type = 0,
  guess = 0.1,
): number {
  if (nper <= 0 || pv === 0) return 0;

  const maxIter = 100;
  const tol = 1e-10;
  let r = guess;

  for (let i = 0; i < maxIter; i++) {
    const pow = Math.pow(1 + r, nper);
    const f =
      pv * pow +
      pmt * (1 + r * type) * ((pow - 1) / r) +
      fv;
    const df =
      nper * pv * Math.pow(1 + r, nper - 1) +
      pmt *
        (1 + r * type) *
        ((nper * Math.pow(1 + r, nper - 1)) / r -
          (pow - 1) / (r * r));

    if (Math.abs(df) < tol) break;
    const next = r - f / df;
    if (Math.abs(next - r) < tol) return next;
    r = next;
  }

  return isFinite(r) ? r : 0;
}

export function calcTermLoan(loan: TermLoanInput): TermLoanResult | null {
  const { principal, monthlyPayment, totalPeriods } = loan;
  const paidPeriods = loan.paidPeriods ?? 0;

  if (
    principal <= 0 ||
    monthlyPayment <= 0 ||
    totalPeriods <= 0 ||
    paidPeriods > totalPeriods
  ) {
    return null;
  }

  const remaining = totalPeriods - paidPeriods;
  const outstanding = remaining * monthlyPayment;
  const principalPortion = principal / totalPeriods;
  const monthlyFlat =
    principal > 0
      ? (monthlyPayment - principalPortion) / principal
      : 0;

  let annualRate = 0;
  let apr = 0;

  try {
    annualRate = rate(totalPeriods, -monthlyPayment, principal) * 12;
    if (isFinite(annualRate)) {
      apr = Math.pow(1 + annualRate / 12, 12) - 1;
    }
  } catch {
    annualRate = 0;
    apr = 0;
  }

  const interestPortion = principal * monthlyFlat;

  return {
    outstanding,
    monthlyFlat,
    apr,
    annualRate,
    interestPortion,
    principalPortion,
  };
}

export function calcRevolvingLoan(
  loan: RevolvingLoanInput,
): RevolvingLoanResult | null {
  const { principal, outstanding, totalPeriods, category, customRate } = loan;
  const revRate = getRevolvingRate(category, customRate);

  if (outstanding <= 0 || totalPeriods <= 0 || !category) return null;

  const monthlyPayment = revRate * outstanding;
  const principalPortion = principal / totalPeriods;
  const monthlyFlat =
    principal > 0
      ? (monthlyPayment - principalPortion) / principal
      : revRate;

  let annualRate = 0;
  let apr = 0;

  if (principal > 0 && monthlyPayment > 0) {
    try {
      annualRate = rate(totalPeriods, -monthlyPayment, principal) * 12;
      if (isFinite(annualRate)) {
        apr = Math.pow(1 + annualRate / 12, 12) - 1;
      }
    } catch {
      annualRate = revRate * 12;
      apr = Math.pow(1 + revRate, 12) - 1;
    }
  }

  const interestPortion = principal * monthlyFlat;

  return {
    monthlyPayment,
    monthlyFlat,
    apr,
    annualRate,
    interestPortion,
    principalPortion,
  };
}

export function calcDsr(input: DsrInput): DsrResult {
  const {
    loanMonthlyPayment,
    mortgageMonthly,
    rent,
    stressExtraPayment,
    totalOutstanding,
    monthlyIncome,
  } = input;

  const totalDebtService =
    loanMonthlyPayment + mortgageMonthly + rent + stressExtraPayment;
  const currentDsr =
    monthlyIncome > 0 ? totalDebtService / monthlyIncome : 0;

  return {
    currentDsr,
    privateDsrLimit: 0.7,
    privateDsrMaxPayment: monthlyIncome * 0.7,
    uceRatio: monthlyIncome > 0 ? totalOutstanding / monthlyIncome : 0,
    uceLimit: monthlyIncome * 20,
    mortgageDsrLimit: 0.8,
    mortgageDsrMaxPayment: monthlyIncome * 0.8,
    uceLimitMortgage: monthlyIncome * 30,
    remainingIncomeAfterDsr:
      monthlyIncome > 0 ? monthlyIncome - totalDebtService : 0,
    mortgageRemainingCapacity:
      monthlyIncome > 0
        ? monthlyIncome * 0.8 - totalDebtService
        : 0,
  };
}

export function calcEffectivePropertyValuation(
  propertyValuation: number,
  ownershipRatio: number,
): number {
  if (propertyValuation <= 0 || ownershipRatio <= 0) return 0;
  return propertyValuation * ownershipRatio;
}

export function calcStressExtraPayment(
  mortgageMonthly: number,
  ltvRatio: number,
): number {
  return mortgageMonthly * ltvRatio;
}

export function formatHKD(n: number, decimals = 0): string {
  if (!isFinite(n)) return "—";
  return `HK$${n.toLocaleString("zh-HK", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export function formatPercent(n: number, decimals = 4): string {
  if (!isFinite(n)) return "—";
  return `${(n * 100).toFixed(decimals)}%`;
}

/** APR 等年化利率顯示用 3 位小數 */
export function formatAprPercent(n: number): string {
  return formatPercent(n, 3);
}

/** 月平息顯示用 4 位小數 */
export function formatMonthlyFlatPercent(n: number): string {
  return formatPercent(n, 4);
}

function newId() {
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function emptyTermLoan(): TermLoanInput {
  return {
    id: newId(),
    bank: "",
    category: "",
    principal: 0,
    monthlyPayment: 0,
    paidPeriods: null,
    totalPeriods: 0,
  };
}

export function emptyRevolvingLoan(): RevolvingLoanInput {
  return {
    id: newId(),
    bank: "",
    category: "",
    principal: 0,
    outstanding: 0,
    totalPeriods: 0,
  };
}

export function emptyProperty(): PropertyStressInput {
  return {
    name: "",
    propertyValuation: 0,
    mortgageAmount: 0,
    mortgageMonthly: 0,
    remainingPeriods: 0,
    totalPeriods: 0,
    rent: 0,
    ltvRatio: 0,
    ownershipRatio: 1,
  };
}
