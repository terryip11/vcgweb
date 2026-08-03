import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/auth";
import { USER_ROLES } from "@/lib/admin/constants";
import {
  HK_PHONE_INVALID_MESSAGE,
  normalizeHKPhoneForStorage,
} from "@/lib/phone/hk-phone";
import { deleteAdminMember, updateAdminMember } from "@/lib/supabase/admin";
import type { UserRole } from "@/types";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireAdminApi();
  if (!auth) {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  try {
    const { id } = await context.params;
    const body = (await request.json()) as {
      fullName?: string | null;
      phone?: string | null;
      role?: UserRole;
    };

    if (body.role && !USER_ROLES.includes(body.role)) {
      return NextResponse.json({ error: "無效的角色" }, { status: 400 });
    }

    let phone = body.phone;
    if (phone !== undefined && phone !== null && phone !== "") {
      const normalized = normalizeHKPhoneForStorage(phone);
      if (!normalized) {
        return NextResponse.json(
          { error: HK_PHONE_INVALID_MESSAGE },
          { status: 400 },
        );
      }
      phone = normalized;
    }

    const result = await updateAdminMember(auth.supabase, id, {
      fullName: body.fullName,
      phone,
      role: body.role,
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

    if (id === auth.user.id) {
      return NextResponse.json(
        { error: "無法刪除自己的帳戶" },
        { status: 400 },
      );
    }

    const result = await deleteAdminMember(id);

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
