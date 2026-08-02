import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { notifyAdminNewLead } from "@/lib/notifications/lead-email";
import { guardPublicApi } from "@/lib/security/public-api";
import type { LeadPayload } from "@/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadPayload & {
      turnstileToken?: string;
    };

    const blocked = await guardPublicApi(request, {
      namespace: "leads",
      limit: 8,
      windowMs: 60_000,
      turnstileToken: body.turnstileToken,
    });
    if (blocked) return blocked;

    if (!body.name?.trim() || !body.phone?.trim()) {
      return NextResponse.json(
        { error: "姓名及電話為必填" },
        { status: 400 },
      );
    }

    const authClient = await createClient();
    let userId: string | null = null;
    if (authClient) {
      const {
        data: { user },
      } = await authClient.auth.getUser();
      userId = user?.id ?? null;
    }

    const leadData = {
      name: body.name.trim(),
      phone: body.phone.trim(),
      email: body.email?.trim() || null,
      loan_amount: body.loanAmount ?? null,
      loan_category: body.loanCategory ?? null,
      product_id: body.productId ?? null,
      source: body.source ?? "website",
      status: "new",
      notes: body.notes?.trim() || null,
      user_id: userId,
      referral_code: body.referralCode?.trim().toUpperCase() || null,
    };

    const supabase = createServiceClient();
    if (!supabase) {
      console.error("[Lead] Supabase not configured");
      return NextResponse.json({ error: "伺服器設定錯誤" }, { status: 503 });
    }

    const { data, error } = await supabase
      .from("leads")
      .insert(leadData)
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "儲存失敗" }, { status: 500 });
    }

    notifyAdminNewLead({
      name: leadData.name,
      phone: leadData.phone,
      email: leadData.email ?? undefined,
      loanAmount: leadData.loan_amount ?? undefined,
      loanCategory: leadData.loan_category ?? undefined,
      productId: leadData.product_id ?? undefined,
      source: leadData.source ?? undefined,
      notes: leadData.notes ?? undefined,
    }).catch(() => {});

    return NextResponse.json({ success: true, id: data.id });
  } catch {
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}
