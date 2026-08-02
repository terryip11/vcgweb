"use client";

import { useState } from "react";
import {
  AFFILIATE_LINK_TARGETS,
  AFFILIATE_PROMO_COPY,
} from "@/data/affiliate-portal";
import { buildReferralLink } from "@/lib/affiliate/referral";

export default function ReferralToolkit({
  referralCode,
  siteOrigin,
}: {
  referralCode: string;
  siteOrigin: string;
}) {
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] = useState<
    (typeof AFFILIATE_LINK_TARGETS)[number]["path"]
  >(AFFILIATE_LINK_TARGETS[0].path);

  const mainLink = buildReferralLink(selectedPath, referralCode, siteOrigin);

  async function copy(text: string, key: string) {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">專屬推廣連結</h2>
        <p className="mt-1 text-sm text-slate-500">
          您的代碼：<code className="font-bold text-teal-700">{referralCode}</code>
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {AFFILIATE_LINK_TARGETS.map((target) => (
            <button
              key={target.path}
              type="button"
              onClick={() => setSelectedPath(target.path)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                selectedPath === target.path
                  ? "bg-teal-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {target.label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start">
          <div className="flex-1">
            <p className="mb-2 break-all rounded-xl bg-slate-50 px-4 py-3 font-mono text-xs text-slate-700">
              {mainLink}
            </p>
            <button
              type="button"
              onClick={() => void copy(mainLink, "link")}
              className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white hover:bg-teal-700"
            >
              {copied === "link" ? "已複製 ✓" : "複製連結"}
            </button>
          </div>

          <div className="flex flex-col items-center rounded-xl border border-slate-100 bg-slate-50 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(mainLink)}`}
              alt="推廣 QR Code"
              width={160}
              height={160}
              className="rounded-lg"
            />
            <p className="mt-2 text-xs text-slate-500">掃描 QR 帶 ref 追蹤</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">推廣文案素材</h2>
        <p className="mt-1 text-sm text-slate-500">複製後貼到社交媒體或文章</p>
        <ul className="mt-4 space-y-4">
          {AFFILIATE_PROMO_COPY.map((item) => {
            const link = buildReferralLink(
              item.id === "pl"
                ? "/compare"
                : item.id === "sme"
                  ? "/sme"
                  : "/funds",
              referralCode,
              siteOrigin,
            );
            const text = item.text.replace("{link}", link);
            return (
              <li
                key={item.id}
                className="rounded-xl border border-slate-100 bg-slate-50 p-4"
              >
                <p className="text-xs font-semibold text-slate-500">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{text}</p>
                <button
                  type="button"
                  onClick={() => void copy(text, item.id)}
                  className="mt-3 text-xs font-semibold text-teal-600 hover:underline"
                >
                  {copied === item.id ? "已複製 ✓" : "複製文案"}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
