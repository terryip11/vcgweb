import { NextResponse } from "next/server";
import { requireAffiliateApi } from "@/lib/affiliate/auth";
import {
  getAffiliateCommissions,
  getAffiliateDashboardStats,
} from "@/lib/supabase/affiliate";

export async function GET() {
  const auth = await requireAffiliateApi();
  if (!auth) {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  const stats = await getAffiliateDashboardStats(
    auth.partner.referralCode!,
    auth.partner,
  );
  const commissions = await getAffiliateCommissions(auth.partner.id);

  return NextResponse.json({ stats, commissions });
}
