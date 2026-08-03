import { NextResponse } from "next/server";
import { LEAD_STATUSES, LOAN_CATEGORIES } from "@/lib/admin/constants";
import { requireAdminApi } from "@/lib/admin/auth";
import {
  HK_PHONE_INVALID_MESSAGE,
  normalizeHKPhoneForStorage,
} from "@/lib/phone/hk-phone";
import { deleteAdminLead, updateAdminLead } from "@/lib/supabase/admin";
import type { LeadStatus, LoanCategory } from "@/types";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireAdminApi();
  if (!auth) {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  try {
    const { supabase } = auth;
    const { id } = await context.params;
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

    if (body.status && !LEAD_STATUSES.includes(body.status as LeadStatus)) {
      return NextResponse.json({ error: "無效的狀態" }, { status: 400 });
    }

    if (
      body.loanCategory &&
      !LOAN_CATEGORIES.includes(body.loanCategory as LoanCategory)
    ) {
      return NextResponse.json({ error: "無效的貸款類別" }, { status: 400 });
    }

    let phone = body.phone;
    if (phone !== undefined) {
      const normalized = normalizeHKPhoneForStorage(phone);
      if (!normalized) {
        return NextResponse.json(
          { error: HK_PHONE_INVALID_MESSAGE },
          { status: 400 },
        );
      }
      phone = normalized;
    }

    const result = await updateAdminLead(supabase, id, {
      name: body.name,
      phone,
      email: body.email,
      loanAmount: body.loanAmount,
      loanCategory: body.loanCategory,
      productId: body.productId,
      source: body.source,
      status: body.status as LeadStatus | undefined,
      notes: body.notes,
      referralCode: body.referralCode,
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error ?? "更新失敗" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireAdminApi();
  if (!auth) {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  try {
    const { id } = await context.params;
    const result = await deleteAdminLead(auth.supabase, id);

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error ?? "刪除失敗" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}
