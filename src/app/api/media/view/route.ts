import { GetObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { getR2Client } from "@/lib/r2/client";
import { getR2Bucket, getR2PublicUrl } from "@/lib/r2/config";

/** 公開圖片代理（未設定 R2_PUBLIC_URL 時使用） */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (!key || !key.startsWith("public/")) {
    return NextResponse.json({ error: "無效請求" }, { status: 400 });
  }

  const publicBase = getR2PublicUrl();
  if (publicBase) {
    return NextResponse.redirect(`${publicBase}/${key}`);
  }

  const client = getR2Client();
  if (!client) {
    return NextResponse.json({ error: "R2 尚未設定" }, { status: 503 });
  }

  try {
    const result = await client.send(
      new GetObjectCommand({
        Bucket: getR2Bucket(),
        Key: key,
      }),
    );

    const body = result.Body;
    if (!body) {
      return NextResponse.json({ error: "找不到檔案" }, { status: 404 });
    }

    const bytes = await body.transformToByteArray();

    return new NextResponse(Buffer.from(bytes), {
      headers: {
        "Content-Type": result.ContentType ?? "application/octet-stream",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "找不到檔案" }, { status: 404 });
  }
}
