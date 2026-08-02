import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { authorizeMediaUpload } from "@/lib/media/auth";
import { validateMediaUpload } from "@/lib/media/validate";
import { createPresignedUploadUrl } from "@/lib/r2/client";
import { isR2Configured } from "@/lib/r2/config";
import { buildObjectKey } from "@/lib/r2/keys";
import { createClient } from "@/lib/supabase/server";
import type { MediaEntityType } from "@/types";

export async function POST(request: Request) {
  if (!isR2Configured()) {
    return NextResponse.json({ error: "R2 尚未設定" }, { status: 503 });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "伺服器設定錯誤" }, { status: 500 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  try {
    const body = (await request.json()) as {
      entityType: MediaEntityType;
      entityId: string;
      category: string;
      fileName: string;
      mimeType: string;
      sizeBytes: number;
    };

    if (
      !body.entityType ||
      !body.entityId ||
      !body.category ||
      !body.mimeType ||
      !body.sizeBytes
    ) {
      return NextResponse.json({ error: "缺少必要參數" }, { status: 400 });
    }

    const validation = validateMediaUpload({
      entityType: body.entityType,
      category: body.category,
      mimeType: body.mimeType,
      sizeBytes: body.sizeBytes,
    });

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const auth = await authorizeMediaUpload(supabase, user, {
      entityType: body.entityType,
      entityId: body.entityId,
    });

    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: 403 });
    }

    const assetId = randomUUID();
    const { objectKey, isPublic } = buildObjectKey({
      entityType: body.entityType,
      entityId: body.entityId,
      category: body.category,
      mimeType: body.mimeType,
      assetId,
    });

    const uploadUrl = await createPresignedUploadUrl(objectKey, body.mimeType);
    if (!uploadUrl) {
      return NextResponse.json({ error: "無法產生上傳連結" }, { status: 500 });
    }

    return NextResponse.json({
      assetId,
      objectKey,
      uploadUrl,
      isPublic,
    });
  } catch {
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}
