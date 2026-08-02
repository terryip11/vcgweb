import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { notifyAdminNewAffiliate } from "@/lib/notifications/lead-email";
import { guardPublicApi } from "@/lib/security/public-api";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      phone?: string;
      email?: string;
      channel?: string;
      website?: string;
      audience?: string;
      turnstileToken?: string;
    };

    const blocked = await guardPublicApi(request, {
      namespace: "affiliate-apply",
      limit: 5,
      windowMs: 60_000,
      turnstileToken: body.turnstileToken,
    });
    if (blocked) return blocked;

    if (!body.name?.trim() || !body.phone?.trim() || !body.email?.trim()) {
      return NextResponse.json(
        { error: "姓名、電話及電郵為必填" },
        { status: 400 },
      );
    }

    const email = body.email.trim().toLowerCase();
    const phone = body.phone.trim();

    const supabase = createServiceClient();
    if (!supabase) {
      return NextResponse.json({ error: "伺服器設定錯誤" }, { status: 503 });
    }

    const { data: existingByEmail } = await supabase
      .from("affiliate_partners")
      .select("id, status")
      .ilike("email", email)
      .in("status", ["pending", "approved"])
      .limit(1)
      .maybeSingle();

    if (existingByEmail) {
      return NextResponse.json(
        { error: "此電郵已有待審核或已批准的推廣夥伴申請" },
        { status: 409 },
      );
    }

    const { data: existingByPhone } = await supabase
      .from("affiliate_partners")
      .select("id, status")
      .eq("phone", phone)
      .in("status", ["pending", "approved"])
      .limit(1)
      .maybeSingle();

    if (existingByPhone) {
      return NextResponse.json(
        { error: "此電話已有待審核或已批准的推廣夥伴申請" },
        { status: 409 },
      );
    }

    const row = {
      name: body.name.trim(),
      phone,
      email,
      channel: body.channel?.trim() || null,
      website: body.website?.trim() || null,
      audience: body.audience?.trim() || null,
      status: "pending",
    };

    const { data, error } = await supabase
      .from("affiliate_partners")
      .insert(row)
      .select("id")
      .single();

    if (error) {
      console.error("Affiliate apply error:", error);
      return NextResponse.json({ error: "提交失敗" }, { status: 500 });
    }

    notifyAdminNewAffiliate({
      name: row.name,
      phone: row.phone,
      email: row.email,
      channel: row.channel ?? undefined,
      website: row.website ?? undefined,
    }).catch(() => {});

    return NextResponse.json({ success: true, id: data.id });
  } catch {
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}
