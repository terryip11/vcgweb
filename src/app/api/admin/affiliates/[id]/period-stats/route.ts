import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/auth";
import {
  countAffiliateLeadsForPeriod,
  getAdminAffiliatePartnerById,
} from "@/lib/supabase/admin";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  const auth = await requireAdminApi();
  if (!auth) {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period")?.trim();

  if (!period || !/^\d{4}-\d{2}$/.test(period)) {
    return NextResponse.json({ error: "請提供 YYYY-MM 格式月份" }, { status: 400 });
  }

  const partner = await getAdminAffiliatePartnerById(auth.supabase, id);
  if (!partner) {
    return NextResponse.json({ error: "找不到夥伴" }, { status: 404 });
  }

  if (!partner.referralCode) {
    return NextResponse.json({
      periodLabel: period,
      leadCount: 0,
      suggestedAmountHkd: null,
      commissionCplHkd: partner.commissionCplHkd ?? null,
    });
  }

  const leadCount = await countAffiliateLeadsForPeriod(
    auth.supabase,
    partner.referralCode,
    period,
  );

  const cpl = partner.commissionCplHkd;
  const suggestedAmountHkd =
    cpl != null ? Math.round(leadCount * cpl * 100) / 100 : null;

  return NextResponse.json({
    periodLabel: period,
    leadCount,
    suggestedAmountHkd,
    commissionCplHkd: cpl ?? null,
  });
}
