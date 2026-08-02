import { NextResponse } from "next/server";
import { LEAD_STATUSES } from "@/lib/admin/constants";
import { requireAdminApi } from "@/lib/admin/auth";
import { updateAdminLead } from "@/lib/supabase/admin";
import type { LeadStatus } from "@/types";

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
      status?: string;
      notes?: string | null;
    };

    if (body.status && !LEAD_STATUSES.includes(body.status as LeadStatus)) {
      return NextResponse.json({ error: "無效的狀態" }, { status: 400 });
    }

    const result = await updateAdminLead(supabase, id, {
      status: body.status,
      notes: body.notes,
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
