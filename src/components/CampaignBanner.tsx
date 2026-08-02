"use client";

import { useEffect, useState } from "react";
import { trackAffiliateClick } from "@/lib/analytics/track-click";
import type { Campaign } from "@/types";

interface CampaignBannerProps {
  campaigns: Campaign[];
}

export default function CampaignBanner({ campaigns }: CampaignBannerProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (campaigns.length <= 1) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % campaigns.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [campaigns.length]);

  if (!campaigns.length) return null;

  const current = campaigns[active];

  function daysLeft(expiresAt?: string) {
    if (!expiresAt) return null;
    const diff = Math.ceil(
      (new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    return diff > 0 ? diff : null;
  }

  const remaining = daysLeft(current.expiresAt);

  return (
    <section className="bg-slate-50 py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white shadow-lg sm:p-8">
          {current.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={current.imageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-30"
            />
          )}
          <div className="relative">
          {current.badge && (
            <span className="mb-3 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wide backdrop-blur">
              {current.badge}
              {remaining && ` · 尚餘 ${remaining} 日`}
            </span>
          )}

          <h2 className="mb-2 text-xl font-bold sm:text-2xl">{current.title}</h2>
          <p className="mb-5 max-w-2xl text-sm text-amber-50 sm:text-base">
            {current.subtitle}
          </p>

          <a
            href={current.ctaHref}
            onClick={() =>
              trackAffiliateClick({
                campaignId: current.id,
                source: "campaign_banner",
              })
            }
            className="inline-flex items-center rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-orange-600 transition hover:bg-orange-50"
          >
            {current.ctaText} →
          </a>

          {campaigns.length > 1 && (
            <div className="mt-6 flex gap-2">
              {campaigns.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`第 ${i + 1} 則優惠`}
                  onClick={() => setActive(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === active ? "w-8 bg-white" : "w-4 bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
          </div>
        </div>
      </div>
    </section>
  );
}
