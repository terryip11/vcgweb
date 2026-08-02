import type { User } from "@supabase/supabase-js";
import { isAdminUser } from "@/lib/admin/auth";
import { MAX_LEAD_FILES } from "@/lib/r2/config";
import { countLeadMedia } from "@/lib/supabase/media";
import { createServiceClient } from "@/lib/supabase/service";
import type { MediaEntityType } from "@/types";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function authorizeMediaUpload(
  supabase: SupabaseClient,
  user: User | null,
  input: {
    entityType: MediaEntityType;
    entityId: string;
  },
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { entityType, entityId } = input;

  if (user && (await isAdminUser(supabase, user))) {
    return { ok: true };
  }

  if (entityType === "profile") {
    if (!user || user.id !== entityId) {
      return { ok: false, error: "只能上傳自己的頭像" };
    }
    return { ok: true };
  }

  if (entityType === "product" || entityType === "campaign" || entityType === "site") {
    return { ok: false, error: "需要管理員權限" };
  }

  if (entityType === "lead") {
    const service = createServiceClient();
    if (!service) return { ok: false, error: "伺服器設定錯誤" };

    const { data: lead, error } = await service
      .from("leads")
      .select("id, user_id, created_at")
      .eq("id", entityId)
      .single();

    if (error || !lead) {
      return { ok: false, error: "找不到相關查詢記錄" };
    }

    if (user && lead.user_id === user.id) {
      return { ok: true };
    }

    const created = new Date(lead.created_at as string).getTime();
    const withinHour = Date.now() - created < 60 * 60 * 1000;
    if (withinHour) {
      const count = await countLeadMedia(service, entityId);
      if (count >= MAX_LEAD_FILES) {
        return { ok: false, error: `最多上傳 ${MAX_LEAD_FILES} 個文件` };
      }
      return { ok: true };
    }

    return { ok: false, error: "上傳時限已過，請聯絡 VCG" };
  }

  return { ok: false, error: "未授權" };
}
