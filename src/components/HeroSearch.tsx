"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { LoanCategory } from "@/types";

const WHATSAPP = "85264754756";

interface HeroSearchProps {
  onSearch?: (params: {
    amount: number;
    term: number;
    category: LoanCategory | "all";
  }) => void;
}

const categories: { value: LoanCategory | "all"; label: string }[] = [
  { value: "all", label: "全部貸款" },
  { value: "personal", label: "私人貸款" },
  { value: "tax", label: "稅季貸款" },
  { value: "sme", label: "中小企貸款" },
  { value: "owner", label: "業主貸款" },
  { value: "business", label: "小商務貸款" },
];

export default function HeroSearch({ onSearch }: HeroSearchProps) {
  const router = useRouter();
  const [amount, setAmount] = useState(200000);
  const [term, setTerm] = useState(36);
  const [category, setCategory] = useState<LoanCategory | "all">("all");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch?.({ amount, term, category });

    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    params.set("amount", String(amount));
    params.set("term", String(term));
    router.push(`/compare?${params.toString()}`);
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0c2340] via-[#123a6b] to-[#1a5080] px-4 py-16 sm:py-20">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-blue-100 backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          全港貸款比較及配對平台
        </div>

        <h1 className="mb-4 max-w-2xl text-3xl font-bold leading-tight text-white sm:text-5xl">
          穩健理財，<span className="text-amber-300">由你話事</span>
        </h1>
        <p className="mb-8 max-w-xl text-base text-blue-100 sm:text-lg">
          比較私人貸款、稅季貸款、中小企融資及業主貸款。
          經 VCG 申請享獨家配對及專人跟進。
        </p>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-5 shadow-2xl shadow-black/20 sm:p-6"
        >
          <p className="mb-4 text-sm font-semibold text-slate-700">
            30 秒免費比較貸款方案
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-500">
                貸款金額
              </span>
              <select
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value={50000}>HK$50,000</option>
                <option value={100000}>HK$100,000</option>
                <option value={200000}>HK$200,000</option>
                <option value={500000}>HK$500,000</option>
                <option value={800000}>HK$800,000</option>
                <option value={1000000}>HK$1,000,000+</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-500">
                還款期
              </span>
              <select
                value={term}
                onChange={(e) => setTerm(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value={12}>12 個月</option>
                <option value={24}>24 個月</option>
                <option value={36}>36 個月</option>
                <option value={48}>48 個月</option>
                <option value={60}>60 個月</option>
                <option value={72}>72 個月</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-500">
                貸款類型
              </span>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as LoanCategory | "all")
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-amber-500 px-6 py-3.5 text-sm font-bold text-slate-900 transition hover:bg-amber-400"
            >
              立即比較貸款
            </button>
            <a
              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("你好，我想查詢貸款方案")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-slate-200 px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700"
            >
              WhatsApp 免費查詢
            </a>
          </div>
        </form>

        <div className="mt-8 flex flex-wrap gap-6 text-sm text-blue-200">
          <span>✓ 70+ 合作金融機構</span>
          <span>✓ 24 小時專人跟進</span>
          <span>✓ 免費初步評估</span>
        </div>
      </div>
    </section>
  );
}
