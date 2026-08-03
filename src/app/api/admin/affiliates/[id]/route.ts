import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/auth";
import {
  notifyAffiliateApproved,
  notifyAffiliateRejected,
} from "@/lib/notifications/lead-email";
import {
  HK_PHONE_INVALID_MESSAGE,
  normalizeHKPhoneForStorage,
} from "@/lib/phone/hk-phone";
import {
  deleteAdminAffiliatePartner,
  getAdminAffiliatePartnerById,
  linkAffiliatePartnerUserByEmail,
  updateAffiliatePartner,
} from "@/lib/supabase/admin";
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
    const existing = await getAdminAffiliatePartnerById(auth.supabase, id);
    if (!existing) {
      return NextResponse.json({ error: "找不到夥伴" }, { status: 404 });
    }

    const body = (await request.json()) as {
      name?: string;
      phone?: string;
      email?: string | null;
      channel?: string | null;
      website?: string | null;
      audience?: string | null;
      status?: AffiliatePartner["status"];
      referralCode?: string | null;
      notes?: string | null;
      commissionCplHkd?: number | null;
    };

    const nextReferralCode =
      body.referralCode !== undefined
        ? body.referralCode
        : existing.referralCode ?? null;

    if (body.status === "approved" && !nextReferralCode?.trim()) {
      return NextResponse.json(
        { error: "批准前請設定推廣代碼 (ref)" },
        { status: 400 },
      );
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

    const result = await updateAffiliatePartner(auth.supabase, id, {
      name: body.name,
      phone,
      email: body.email,
      channel: body.channel,
      website: body.website,
      audience: body.audience,
      status: body.status,
      referralCode: body.referralCode,
      notes: body.notes,
      commissionCplHkd: body.commissionCplHkd,
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error ?? "更新失敗" },
        { status: 500 },
      );
    }

    const updated = await getAdminAffiliatePartnerById(auth.supabase, id);
    const email = updated?.email ?? existing.email;

    if (body.status === "approved" && existing.status !== "approved") {
      if (email) {
        await linkAffiliatePartnerUserByEmail(id, email);
        notifyAffiliateApproved({
          name: updated?.name ?? existing.name,
          email,
          referralCode: updated?.referralCode ?? nextReferralCode ?? undefined,
        }).catch(() => {});
      }
    }

    if (body.status === "rejected" && existing.status !== "rejected" && email) {
      notifyAffiliateRejected({
        name: updated?.name ?? existing.name,
        email,
      }).catch(() => {});
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

  const { id } = await context.params;
  const result = await deleteAdminAffiliatePartner(auth.supabase, id);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error ?? "刪除失敗" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
