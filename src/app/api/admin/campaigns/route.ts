import { NextResponse } from "next/server";
import { parseCampaignInput } from "@/lib/admin/parse-input";
import { requireAdminApi } from "@/lib/admin/auth";
import {
  getAdminCampaigns,
  upsertAdminCampaign,
} from "@/lib/supabase/admin";

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth) {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  const campaigns = await getAdminCampaigns(auth.supabase);
  return NextResponse.json({ campaigns });
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (!auth) {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const parsed = parseCampaignInput(body);

    if (parsed.error || !parsed.input) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const result = await upsertAdminCampaign(auth.supabase, parsed.input);
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error ?? "儲存失敗" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, id: parsed.input.id });
  } catch {
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}
