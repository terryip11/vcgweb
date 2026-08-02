import { NextResponse } from "next/server";
import { authorizeMediaUpload } from "@/lib/media/auth";
import { getPublicMediaUrl } from "@/lib/r2/urls";
import { insertMediaAsset } from "@/lib/supabase/media";
import { createServiceClient } from "@/lib/supabase/service";
import { createClient } from "@/lib/supabase/server";
import type { MediaEntityType } from "@/types";

async function syncEntityImageUrl(
  entityType: MediaEntityType,
  entityId: string,
  category: string,
  url: string,
) {
  const service = createServiceClient();
  if (!service) return;

  if (entityType === "product" && category === "product_image") {
    await service
      .from("products")
      .update({ image_url: url, updated_at: new Date().toISOString() })
      .eq("id", entityId);
  }

  if (entityType === "campaign" && category === "campaign_banner") {
    await service
      .from("campaigns")
      .update({ image_url: url, updated_at: new Date().toISOString() })
      .eq("id", entityId);
  }

  if (entityType === "profile" && category === "avatar") {
    await service
      .from("profiles")
      .update({ avatar_url: url, updated_at: new Date().toISOString() })
      .eq("id", entityId);
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "伺服器設定錯誤" }, { status: 500 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const service = createServiceClient();
  if (!service) {
    return NextResponse.json({ error: "伺服器設定錯誤" }, { status: 500 });
  }

  try {
    const body = (await request.json()) as {
      assetId: string;
      objectKey: string;
      entityType: MediaEntityType;
      entityId: string;
      category: string;
      originalName?: string;
      mimeType: string;
      sizeBytes: number;
      isPublic: boolean;
    };

    if (
      !body.assetId ||
      !body.objectKey ||
      !body.entityType ||
      !body.entityId ||
      !body.mimeType ||
      !body.sizeBytes
    ) {
      return NextResponse.json({ error: "缺少必要參數" }, { status: 400 });
    }

    const auth = await authorizeMediaUpload(supabase, user, {
      entityType: body.entityType,
      entityId: body.entityId,
    });

    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: 403 });
    }

    const result = await insertMediaAsset(service, {
      id: body.assetId,
      objectKey: body.objectKey,
      entityType: body.entityType,
      entityId: body.entityId,
      category: body.category,
      originalName: body.originalName,
      mimeType: body.mimeType,
      sizeBytes: body.sizeBytes,
      isPublic: body.isPublic,
      uploadedBy: user?.id ?? null,
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error ?? "儲存失敗" },
        { status: 500 },
      );
    }

    const url = body.isPublic ? getPublicMediaUrl(body.objectKey) : undefined;

    if (url) {
      await syncEntityImageUrl(
        body.entityType,
        body.entityId,
        body.category,
        url,
      );
    }

    return NextResponse.json({ success: true, url, assetId: body.assetId });
  } catch {
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}
