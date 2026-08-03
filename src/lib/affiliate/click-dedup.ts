import { createHash } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { AFFILIATE_HK_COUNTRY } from "@/lib/affiliate/hk-traffic";
import { isHongKongTraffic } from "@/lib/geo/request-geo";
import { getClientIp } from "@/lib/security/rate-limit";

const DEDUP_WINDOW_MS = 24 * 60 * 60 * 1000;

export function getVisitorIpHash(request: Request): string {
  const ip = getClientIp(request);
  const salt = process.env.AFFILIATE_IP_HASH_SALT ?? "vcg-affiliate-ip";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

/** 寫入 DB 用的 country_code；本地 dev 無 header 時可視為 HK */
export function getAffiliateClickCountryCode(request: Request): string | null {
  const cf = request.headers.get("cf-ipcountry");
  if (cf && cf !== "XX" && cf !== "T1") {
    return cf.toUpperCase();
  }
  const vercel = request.headers.get("x-vercel-ip-country");
  if (vercel) return vercel.toUpperCase();
  if (isHongKongTraffic(request)) return AFFILIATE_HK_COUNTRY;
  return null;
}

export function isHongKongAffiliateClick(countryCode: string | null): boolean {
  return countryCode === AFFILIATE_HK_COUNTRY;
}

/** 同一香港 IP + ref 在 24 小時內是否已有有效點擊 */
export async function hasRecentCountedAffiliateClick(
  supabase: SupabaseClient,
  ipHash: string,
  referralCode: string,
): Promise<boolean> {
  const since = new Date(Date.now() - DEDUP_WINDOW_MS).toISOString();
  const code = referralCode.trim().toUpperCase();

  const { count, error } = await supabase
    .from("affiliate_clicks")
    .select("id", { count: "exact", head: true })
    .eq("visitor_ip_hash", ipHash)
    .eq("referral_code", code)
    .eq("country_code", AFFILIATE_HK_COUNTRY)
    .eq("counts_for_stats", true)
    .gte("created_at", since);

  if (error) {
    console.error("[Affiliate click dedup]", error.message);
    return false;
  }

  return (count ?? 0) > 0;
}
