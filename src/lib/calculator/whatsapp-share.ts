import { getCategoryDisplayName } from "@/data/loan-categories";
import {
  formatAprPercent,
  formatHKD,
  formatPercent,
  type DsrResult,
  type PropertyStressInput,
  type RevolvingLoanInput,
  type RevolvingLoanResult,
  type TermLoanInput,
  type TermLoanResult,
} from "@/lib/loan-calculator";
import { getSiteUrl } from "@/lib/site";

export const VCG_WHATSAPP = "85264754756";

export interface CalculatorShareInput {
  termResults: Array<{ loan: TermLoanInput; result: TermLoanResult | null }>;
  revolvingResults: Array<{
    loan: RevolvingLoanInput;
    result: RevolvingLoanResult | null;
  }>;
  totals: {
    totalPrincipal: number;
    totalMonthly: number;
    totalOutstanding: number;
  };
  property: PropertyStressInput;
  stressExtra: number;
  effectiveValuation: number;
  monthlyIncome: number;
  dsr: DsrResult;
}

function bankLabel(bank: string, bankOther?: string): string {
  const name = bank.trim() || bankOther?.trim();
  return name || "未指定機構";
}

export function hasShareableCalculatorResults(input: CalculatorShareInput): boolean {
  if (input.monthlyIncome > 0) return true;
  if (
    input.totals.totalMonthly > 0 ||
    input.totals.totalOutstanding > 0 ||
    input.totals.totalPrincipal > 0
  ) {
    return true;
  }
  if (
    input.property.propertyValuation > 0 ||
    input.property.mortgageMonthly > 0 ||
    input.property.mortgageAmount > 0 ||
    input.property.rent > 0
  ) {
    return true;
  }
  if (input.termResults.some(({ result }) => result !== null)) return true;
  if (input.revolvingResults.some(({ result }) => result !== null)) return true;
  return false;
}

export function buildCalculatorShareMessage(input: CalculatorShareInput): string {
  const lines: string[] = [
    "【VCG 貸款計算結果】",
    "",
  ];

  const termWithResults = input.termResults.filter(({ result }) => result !== null);
  if (termWithResults.length > 0) {
    lines.push("① 分期貸款");
    termWithResults.forEach(({ loan, result }, idx) => {
      lines.push(
        `#${idx + 1} ${bankLabel(loan.bank, loan.bankOther)} · ${getCategoryDisplayName(loan.category, loan.categoryOther)}`,
      );
      lines.push(`欠款：${formatHKD(result!.outstanding, 2)}`);
      lines.push(`月供：${formatHKD(loan.monthlyPayment, 2)}`);
      lines.push(`APR：${formatAprPercent(result!.apr)}`);
      lines.push("");
    });
  }

  const revWithResults = input.revolvingResults.filter(({ result }) => result !== null);
  if (revWithResults.length > 0) {
    lines.push("② 循環 / 卡數貸款");
    revWithResults.forEach(({ loan, result }, idx) => {
      lines.push(
        `#${idx + 1} ${bankLabel(loan.bank, loan.bankOther)} · ${getCategoryDisplayName(loan.category, loan.categoryOther)}`,
      );
      lines.push(`欠款：${formatHKD(loan.outstanding, 2)}`);
      lines.push(`月供：${formatHKD(result!.monthlyPayment, 2)}`);
      lines.push("");
    });
  }

  if (
    input.totals.totalPrincipal > 0 ||
    input.totals.totalMonthly > 0 ||
    input.totals.totalOutstanding > 0
  ) {
    lines.push("③ 貸款匯總");
    lines.push(`總貸款金額：${formatHKD(input.totals.totalPrincipal, 2)}`);
    lines.push(`總月供：${formatHKD(input.totals.totalMonthly, 2)}`);
    lines.push(`總欠款：${formatHKD(input.totals.totalOutstanding, 2)}`);
    lines.push("");
  }

  if (
    input.property.propertyValuation > 0 ||
    input.property.mortgageMonthly > 0 ||
    input.stressExtra > 0
  ) {
    lines.push("④ 物業壓力測試");
    if (input.property.name.trim()) {
      lines.push(`物業：${input.property.name.trim()}`);
    }
    if (input.effectiveValuation > 0) {
      lines.push(`有效物業估價：${formatHKD(input.effectiveValuation, 2)}`);
    }
    if (input.property.mortgageMonthly > 0) {
      lines.push(`按揭月供：${formatHKD(input.property.mortgageMonthly, 2)}`);
    }
    lines.push(`壓力測試額外月供：${formatHKD(input.stressExtra, 2)}`);
    lines.push("");
  }

  if (input.monthlyIncome > 0 || input.dsr.currentDsr > 0) {
    lines.push("⑤ DSR 供款比率");
    if (input.monthlyIncome > 0) {
      lines.push(`月收入：${formatHKD(input.monthlyIncome, 2)}`);
    }
    lines.push(`DSR 現有比率：${formatPercent(input.dsr.currentDsr, 2)}`);
    lines.push(`DSR 剩餘資金/月：${formatHKD(input.dsr.remainingIncomeAfterDsr, 2)}`);
    lines.push("");
  }

  lines.push(`計算機：${getSiteUrl()}/calculator`);
  lines.push("（僅供參考，不構成財務建議）");

  return lines.join("\n").trim();
}

/** 分享到 WhatsApp（由使用者選擇聯絡人） */
export function buildWhatsAppShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/** 傳送結果給 VCG 顧問 */
export function buildVcgWhatsAppConsultUrl(text: string): string {
  const message = `${text}\n\n你好，我想請 VCG 協助評估以上貸款狀況，麻煩聯絡我，謝謝。`;
  return `https://wa.me/${VCG_WHATSAPP}?text=${encodeURIComponent(message)}`;
}
