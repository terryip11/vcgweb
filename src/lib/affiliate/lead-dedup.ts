import type { SupabaseClient } from "@supabase/supabase-js";
import { AFFILIATE_HK_COUNTRY } from "@/lib/affiliate/hk-traffic";
import { isHongKongAffiliateClick } from "@/lib/affiliate/click-dedup";

const DEDUP_WINDOW_MS = 24 * 60 * 60 * 1000;

/** 同一電話在 24 小時內是否已有有效香港查詢（全站去重） */
export async function hasRecentCountedLeadByPhone(
  supabase: SupabaseClient,
  phone: string,
  countryCode: string | null,
): Promise<boolean> {
  if (!isHongKongAffiliateClick(countryCode)) return false;

  const since = new Date(Date.now() - DEDUP_WINDOW_MS).toISOString();

  const { count, error } = await supabase
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("phone", phone)
    .eq("country_code", AFFILIATE_HK_COUNTRY)
    .eq("counts_for_stats", true)
    .gte("created_at", since);

  if (error) {
    console.error("[Lead phone dedup]", error.message);
    return false;
  }

  return (count ?? 0) > 0;
}
