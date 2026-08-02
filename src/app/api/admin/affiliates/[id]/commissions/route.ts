import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/auth";
import { createAffiliateCommissionSettlement } from "@/lib/supabase/affiliate";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  const auth = await requireAdminApi();
  if (!auth) {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  const { id } = await context.params;

  try {
    const body = (await request.json()) as {
      periodLabel?: string;
      leadCount?: number;
      amountHkd?: number;
      notes?: string;
      markPaid?: boolean;
    };

    if (!body.periodLabel?.trim() || body.leadCount == null || body.amountHkd == null) {
      return NextResponse.json({ error: "缺少必要參數" }, { status: 400 });
    }

    const ok = await createAffiliateCommissionSettlement(auth.supabase, id, {
      periodLabel: body.periodLabel.trim(),
      leadCount: body.leadCount,
      amountHkd: body.amountHkd,
      notes: body.notes,
      markPaid: body.markPaid,
    });

    if (!ok) {
      return NextResponse.json({ error: "建立失敗" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}
