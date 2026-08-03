import LoanCalculatorApp from "@/components/calculator/LoanCalculatorApp";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "貸款計算機 | 創健佳商業事務所 | VCG",
  description:
    "VCG 貸款計算機 — 計算月供、月平息、APR、DSR 供款比率及物業壓力測試。",
};

export default function CalculatorPage() {
  return <LoanCalculatorApp />;
}
