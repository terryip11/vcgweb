import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/auth";
import { attachMediaUrls, getMediaByEntity } from "@/lib/supabase/media";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireAdminApi();
  if (!auth) {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  const { id } = await context.params;
  const assets = await getMediaByEntity(auth.supabase, "lead", id);

  return NextResponse.json({ assets });
}
