import { NextResponse } from "next/server";
import { parseCampaignInput } from "@/lib/admin/parse-input";
import { requireAdminApi } from "@/lib/admin/auth";
import {
  deactivateAdminCampaign,
  getAdminCampaignById,
  upsertAdminCampaign,
} from "@/lib/supabase/admin";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireAdminApi();
  if (!auth) {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  const { id } = await context.params;
  const campaign = await getAdminCampaignById(auth.supabase, id);

  if (!campaign) {
    return NextResponse.json({ error: "找不到活動" }, { status: 404 });
  }

  return NextResponse.json({ campaign });
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireAdminApi();
  if (!auth) {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  try {
    const { id } = await context.params;
    const body = (await request.json()) as Record<string, unknown>;
    body.id = id;

    const parsed = parseCampaignInput(body);
    if (parsed.error || !parsed.input) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const result = await upsertAdminCampaign(auth.supabase, parsed.input);
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

  const { id } = await context.params;
  const result = await deactivateAdminCampaign(auth.supabase, id);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error ?? "下架失敗" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
