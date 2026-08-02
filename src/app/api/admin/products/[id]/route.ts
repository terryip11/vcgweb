import { NextResponse } from "next/server";
import { parseProductInput } from "@/lib/admin/parse-input";
import { requireAdminApi } from "@/lib/admin/auth";
import {
  deactivateAdminProduct,
  getAdminProductById,
  upsertAdminProduct,
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
  const product = await getAdminProductById(auth.supabase, id);

  if (!product) {
    return NextResponse.json({ error: "找不到產品" }, { status: 404 });
  }

  return NextResponse.json({ product });
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

    const parsed = parseProductInput(body);
    if (parsed.error || !parsed.input) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const result = await upsertAdminProduct(auth.supabase, parsed.input);
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
  const result = await deactivateAdminProduct(auth.supabase, id);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error ?? "下架失敗" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
