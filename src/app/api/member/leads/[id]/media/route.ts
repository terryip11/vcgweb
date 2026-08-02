import { NextResponse } from "next/server";
import { attachMediaUrls } from "@/lib/supabase/media";
import { createClient } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "伺服器設定錯誤" }, { status: 500 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const { id: leadId } = await context.params;

  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select("id")
    .eq("id", leadId)
    .eq("user_id", user.id)
    .single();

  if (leadError || !lead) {
    return NextResponse.json({ error: "找不到查詢記錄" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("media_assets")
    .select("*")
    .eq("entity_type", "lead")
    .eq("entity_id", leadId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "載入失敗" }, { status: 500 });
  }

  const assets = await attachMediaUrls(
    (data ?? []).map((row) => ({
      id: row.id,
      objectKey: row.object_key,
      entityType: row.entity_type,
      entityId: row.entity_id ?? undefined,
      category: row.category,
      originalName: row.original_name ?? undefined,
      mimeType: row.mime_type,
      sizeBytes: row.size_bytes,
      isPublic: row.is_public,
      uploadedBy: row.uploaded_by ?? undefined,
      createdAt: row.created_at,
    })),
  );

  return NextResponse.json({ assets });
}
