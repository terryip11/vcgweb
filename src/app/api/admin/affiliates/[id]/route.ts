import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/auth";
import { updateAffiliatePartner } from "@/lib/supabase/admin";
import type { AffiliatePartner } from "@/types";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireAdminApi();
  if (!auth) {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  const { id } = await context.params;

  try {
    const body = (await request.json()) as {
    status?: AffiliatePartner["status"];
    referralCode?: string | null;
    notes?: string | null;
    commissionCplHkd?: number | null;
  };

    const ok = await updateAffiliatePartner(auth.supabase, id, body);
    if (!ok) {
      return NextResponse.json({ error: "更新失敗" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}
