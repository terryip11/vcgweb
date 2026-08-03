import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/auth";
import {
  HK_PHONE_INVALID_MESSAGE,
  normalizeHKPhoneForStorage,
} from "@/lib/phone/hk-phone";
import { createAdminAffiliatePartner } from "@/lib/supabase/admin";
import type { AffiliatePartner } from "@/types";

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
      channel?: string | null;
      website?: string | null;
      audience?: string | null;
      referralCode?: string | null;
      commissionCplHkd?: number | null;
      status?: AffiliatePartner["status"];
      notes?: string | null;
    };

    if (!body.name?.trim() || !body.phone?.trim()) {
      return NextResponse.json(
        { error: "姓名及電話為必填" },
        { status: 400 },
      );
    }

    const phone = normalizeHKPhoneForStorage(body.phone);
    if (!phone) {
      return NextResponse.json(
        { error: HK_PHONE_INVALID_MESSAGE },
        { status: 400 },
      );
    }

    const result = await createAdminAffiliatePartner(auth.supabase, {
      name: body.name,
      phone,
      email: body.email,
      channel: body.channel,
      website: body.website,
      audience: body.audience,
      referralCode: body.referralCode,
      commissionCplHkd: body.commissionCplHkd,
      status: body.status ?? "pending",
      notes: body.notes,
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error ?? "建立失敗" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, id: result.id });
  } catch {
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}
