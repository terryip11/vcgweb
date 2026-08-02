import { getStoredReferralCode } from "@/lib/affiliate/referral";

export interface TrackClickPayload {
  productId?: string;
  campaignId?: string;
  source?: string;
  referralCode?: string;
}

/** Fire-and-forget affiliate click tracking */
export function trackAffiliateClick(payload: TrackClickPayload): void {
  if (typeof window === "undefined") return;

  fetch("/api/clicks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      referrer: window.location.pathname,
      referralCode: payload.referralCode ?? getStoredReferralCode(),
    }),
    keepalive: true,
  }).catch(() => {});
}

export function getReferralCodeForLead(): string | null {
  return getStoredReferralCode();
}
