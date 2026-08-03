import { NextResponse } from "next/server";
import {
  getAffiliateClickCountryCode,
  getVisitorIpHash,
  hasRecentCountedAffiliateClick,
  isHongKongAffiliateClick,
} from "@/lib/affiliate/click-dedup";
import { createServiceClient } from "@/lib/supabase/service";
import { enforceRateLimit } from "@/lib/security/rate-limit";

export async function POST(request: Request) {
  try {
    const blocked = enforceRateLimit(request, "clicks", 60, 60_000);
    if (blocked) return blocked;

    const body = (await request.json()) as {
      productId?: string;
      campaignId?: string;
      source?: string;
      referrer?: string;
      referralCode?: string;
    };

    const supabase = createServiceClient();
    if (!supabase) {
      return NextResponse.json({ error: "伺服器設定錯誤" }, { status: 503 });
    }

    const countryCode = getAffiliateClickCountryCode(request);
    const referralCode = body.referralCode?.trim().toUpperCase() || null;
    const ipHash = getVisitorIpHash(request);

    let countsForStats = true;
    if (
      referralCode &&
      isHongKongAffiliateClick(countryCode) &&
      (await hasRecentCountedAffiliateClick(supabase, ipHash, referralCode))
    ) {
      countsForStats = false;
    }

    const { error } = await supabase.from("affiliate_clicks").insert({
      product_id: body.productId ?? null,
      campaign_id: body.campaignId ?? null,
      source: body.source ?? "website",
      referrer: body.referrer ?? null,
      referral_code: referralCode,
      country_code: countryCode,
      visitor_ip_hash: ipHash,
      counts_for_stats: countsForStats,
    });

    if (error) {
      console.error("Click tracking error:", error);
      return NextResponse.json({ error: "記錄失敗" }, { status: 500 });
    }

    return NextResponse.json({ success: true, counted: countsForStats });
  } catch {
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}
