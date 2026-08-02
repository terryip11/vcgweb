import { NextResponse } from "next/server";
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

    const { error } = await supabase.from("affiliate_clicks").insert({
      product_id: body.productId ?? null,
      campaign_id: body.campaignId ?? null,
      source: body.source ?? "website",
      referrer: body.referrer ?? null,
      referral_code: body.referralCode?.trim().toUpperCase() || null,
    });

    if (error) {
      console.error("Click tracking error:", error);
      return NextResponse.json({ error: "記錄失敗" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}
