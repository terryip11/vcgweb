import { NextResponse } from "next/server";
import { authorizeLeadMediaAccess } from "@/lib/media/auth";
import { getMediaByEntity } from "@/lib/supabase/media";
import { createServiceClient } from "@/lib/supabase/service";
import { createClient } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/** 列出 lead 附件（會員、管理員、或提交後 1 小時內訪客） */
export async function GET(_request: Request, context: RouteContext) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "伺服器設定錯誤" }, { status: 500 });
  }

  const { id: leadId } = await context.params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const auth = await authorizeLeadMediaAccess(supabase, user, leadId);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const service = createServiceClient();
  if (!service) {
    return NextResponse.json({ error: "伺服器設定錯誤" }, { status: 500 });
  }

  const assets = await getMediaByEntity(service, "lead", leadId);
  return NextResponse.json({ assets });
}
