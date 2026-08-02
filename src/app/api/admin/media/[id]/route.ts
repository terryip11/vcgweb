import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/auth";
import { deleteR2Object } from "@/lib/r2/client";
import { deleteMediaAsset } from "@/lib/supabase/media";
import { createServiceClient } from "@/lib/supabase/service";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireAdminApi();
  if (!auth) {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  const service = createServiceClient();
  if (!service) {
    return NextResponse.json({ error: "伺服器設定錯誤" }, { status: 500 });
  }

  const { id } = await context.params;
  const asset = await deleteMediaAsset(service, id);

  if (!asset) {
    return NextResponse.json({ error: "找不到檔案" }, { status: 404 });
  }

  await deleteR2Object(asset.objectKey);

  return NextResponse.json({ success: true });
}
