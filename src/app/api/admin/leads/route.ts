import { NextResponse } from "next/server";
import { LEAD_STATUSES } from "@/lib/admin/constants";
import { requireAdminApi } from "@/lib/admin/auth";
import { normalizeHKPhoneForStorage, HK_PHONE_INVALID_MESSAGE } from "@/lib/phone/hk-phone";
import { createAdminLead } from "@/lib/supabase/admin";
import type { LeadStatus, LoanCategory } from "@/types";

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (!auth) {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  try {
    const body = (await request.json()) as {
      name?: string;
      phone?: string;
      email?: string | null;
      loanAmount?: number | null;
      loanCategory?: LoanCategory | null;
      productId?: string | null;
      source?: string;
      status?: string;
      notes?: string | null;
      referralCode?: string | null;
    };

    if (!body.name?.trim() || !body.phone?.trim()) {
      return NextResponse.json(
        { error: "姓名及電話為必填" },
        { status: 400 },
      );
    }

    const normalizedPhone = normalizeHKPhoneForStorage(body.phone);
    if (!normalizedPhone) {
      return NextResponse.json(
        { error: HK_PHONE_INVALID_MESSAGE },
        { status: 400 },
      );
    }

    if (body.status && !LEAD_STATUSES.includes(body.status as LeadStatus)) {
      return NextResponse.json({ error: "無效的狀態" }, { status: 400 });
    }

    const result = await createAdminLead(auth.supabase, {
      name: body.name.trim(),
      phone: normalizedPhone,
      email: body.email,
      loanAmount: body.loanAmount,
      loanCategory: body.loanCategory,
      productId: body.productId,
      source: body.source,
      status: (body.status as LeadStatus) ?? "new",
      notes: body.notes,
      referralCode: body.referralCode,
    });

    if (result.error || !result.data) {
      return NextResponse.json(
        { error: result.error ?? "建立失敗" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, id: result.data.id });
  } catch {
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}
