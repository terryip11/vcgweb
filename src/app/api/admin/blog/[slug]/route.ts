import { NextResponse } from "next/server";
import { parseBlogInput } from "@/lib/admin/parse-input";
import { requireAdminApi } from "@/lib/admin/auth";
import {
  deactivateAdminBlogPost,
  getAdminBlogPostBySlug,
  upsertAdminBlogPost,
} from "@/lib/supabase/admin";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireAdminApi();
  if (!auth) {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  const { slug } = await context.params;
  const post = await getAdminBlogPostBySlug(auth.supabase, slug);

  if (!post) {
    return NextResponse.json({ error: "找不到文章" }, { status: 404 });
  }

  return NextResponse.json({ post });
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireAdminApi();
  if (!auth) {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  try {
    const { slug } = await context.params;
    const body = (await request.json()) as Record<string, unknown>;
    body.slug = slug;

    const parsed = parseBlogInput(body);
    if (parsed.error || !parsed.input) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const result = await upsertAdminBlogPost(auth.supabase, parsed.input);
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

  const { slug } = await context.params;
  const result = await deactivateAdminBlogPost(auth.supabase, slug);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error ?? "下架失敗" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
