import { NextResponse } from "next/server";
import { isAdminUser } from "@/lib/admin/auth";
import { authorizeLeadMediaAccess } from "@/lib/media/auth";
import { getPrivateMediaUrl, getPublicMediaUrl } from "@/lib/r2/urls";
import { getMediaById } from "@/lib/supabase/media";
import { createServiceClient } from "@/lib/supabase/service";
import { createClient } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "伺服器設定錯誤" }, { status: 500 });
  }

  const service = createServiceClient();
  if (!service) {
    return NextResponse.json({ error: "伺服器設定錯誤" }, { status: 500 });
  }

  const { id } = await context.params;
  const asset = await getMediaById(service, id);

  if (!asset) {
    return NextResponse.json({ error: "找不到檔案" }, { status: 404 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isOwner =
    asset.entityType === "profile" &&
    user &&
    asset.entityId === user.id;

  let canView = isOwner || asset.isPublic;

  if (!canView && asset.entityType === "lead" && asset.entityId) {
    const auth = await authorizeLeadMediaAccess(supabase, user, asset.entityId);
    canView = auth.ok;
  }

  if (!canView && user) {
    canView = await isAdminUser(supabase, user);
  }

  if (!canView) {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  const url = asset.isPublic
    ? getPublicMediaUrl(asset.objectKey)
    : await getPrivateMediaUrl(asset.objectKey);

  if (!url) {
    return NextResponse.json({ error: "無法產生連結" }, { status: 500 });
  }

  return NextResponse.json({ url, asset });
}
