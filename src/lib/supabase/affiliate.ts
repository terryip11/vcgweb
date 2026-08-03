import type { SupabaseClient, User } from "@supabase/supabase-js";
import { AFFILIATE_HK_COUNTRY } from "@/lib/affiliate/hk-traffic";
import { createServiceClient } from "@/lib/supabase/service";
import type {
  AffiliateCommission,
  AffiliateDashboardStats,
  AffiliatePartner,
} from "@/types";

function mapPartner(row: Record<string, unknown>): AffiliatePartner {
  return {
    id: row.id as string,
    name: row.name as string,
    email: (row.email as string | null) ?? undefined,
    phone: row.phone as string,
    channel: (row.channel as string | null) ?? undefined,
    website: (row.website as string | null) ?? undefined,
    audience: (row.audience as string | null) ?? undefined,
    referralCode: (row.referral_code as string | null) ?? undefined,
    userId: (row.user_id as string | null) ?? undefined,
    commissionCplHkd:
      row.commission_cpl_hkd != null
        ? Number(row.commission_cpl_hkd)
        : undefined,
    status: row.status as AffiliatePartner["status"],
    notes: (row.notes as string | null) ?? undefined,
    createdAt: row.created_at as string,
    approvedAt: (row.approved_at as string | null) ?? undefined,
  };
}

function mapCommission(row: Record<string, unknown>): AffiliateCommission {
  return {
    id: row.id as string,
    affiliateId: row.affiliate_id as string,
    periodLabel: row.period_label as string,
    leadCount: row.lead_count as number,
    amountHkd: Number(row.amount_hkd),
    status: row.status as AffiliateCommission["status"],
    notes: (row.notes as string | null) ?? undefined,
    createdAt: row.created_at as string,
    paidAt: (row.paid_at as string | null) ?? undefined,
  };
}

/** 以 user_id 或 email 查找推廣夥伴記錄 */
export async function getAffiliatePartnerForUser(
  supabase: SupabaseClient,
  user: User,
): Promise<AffiliatePartner | null> {
  const { data: byUser } = await supabase
    .from("affiliate_partners")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (byUser) return mapPartner(byUser);

  const email = user.email?.toLowerCase();
  if (!email) return null;

  const { data: byEmail } = await supabase
    .from("affiliate_partners")
    .select("*")
    .ilike("email", email)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (byEmail) return mapPartner(byEmail);
  return null;
}

/** 將已批准夥伴的 user_id 與登入帳戶綁定（email 相符） */
export async function linkAffiliatePartnerToUser(user: User): Promise<void> {
  const service = createServiceClient();
  if (!service || !user.email) return;

  const email = user.email.toLowerCase();

  const { data: partner } = await service
    .from("affiliate_partners")
    .select("id, user_id, status")
    .ilike("email", email)
    .in("status", ["approved", "pending"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!partner || partner.user_id) return;

  await service
    .from("affiliate_partners")
    .update({ user_id: user.id })
    .eq("id", partner.id);
}

export async function getAffiliateDashboardStats(
  referralCode: string,
  partner: AffiliatePartner,
): Promise<AffiliateDashboardStats> {
  const service = createServiceClient();
  if (!service) {
    return emptyStats(referralCode, partner);
  }

  const code = referralCode.toUpperCase();
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - 7);
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [{ data: clicks }, { data: leadTimestamps }, { data: recentLeads }, { data: commissions }] =
    await Promise.all([
      service
        .from("affiliate_clicks")
        .select("created_at")
        .eq("referral_code", code)
        .eq("country_code", AFFILIATE_HK_COUNTRY)
        .eq("counts_for_stats", true),
      service
        .from("leads")
        .select("created_at")
        .eq("referral_code", code)
        .eq("country_code", AFFILIATE_HK_COUNTRY)
        .eq("counts_for_stats", true),
      service
        .from("leads")
        .select("id, name, loan_category, status, created_at")
        .eq("referral_code", code)
        .eq("country_code", AFFILIATE_HK_COUNTRY)
        .eq("counts_for_stats", true)
        .order("created_at", { ascending: false })
        .limit(8),
      service
        .from("affiliate_commissions")
        .select("*")
        .eq("affiliate_id", partner.id)
        .order("created_at", { ascending: false }),
    ]);

  const clickRows = clicks ?? [];
  const leadRows = leadTimestamps ?? [];
  const recentLeadRows = recentLeads ?? [];
  const commissionRows = (commissions ?? []).map(mapCommission);

  let weekClicks = 0;
  for (const row of clickRows) {
    if (new Date(row.created_at as string) >= startOfWeek) weekClicks += 1;
  }

  let weekLeads = 0;
  let monthLeads = 0;
  for (const row of leadRows) {
    const created = new Date(row.created_at as string);
    if (created >= startOfWeek) weekLeads += 1;
    if (created >= startOfMonth) monthLeads += 1;
  }

  const paidTotalHkd = commissionRows
    .filter((c) => c.status === "paid")
    .reduce((sum, c) => sum + c.amountHkd, 0);

  const pendingCommissionHkd = commissionRows
    .filter((c) => c.status === "pending")
    .reduce((sum, c) => sum + c.amountHkd, 0);

  const cpl = partner.commissionCplHkd;
  const estimatedPendingHkd =
    pendingCommissionHkd > 0
      ? pendingCommissionHkd
      : cpl != null
        ? monthLeads * cpl
        : undefined;

  return {
    referralCode: code,
    totalClicks: clickRows.length,
    weekClicks,
    totalLeads: leadRows.length,
    weekLeads,
    monthLeads,
    commissionCplHkd: cpl,
    estimatedPendingHkd,
    paidTotalHkd,
    recentLeads: recentLeadRows.map((row) => ({
      id: row.id as string,
      name: row.name as string,
      loanCategory: (row.loan_category as string | null) ?? undefined,
      status: row.status as string,
      createdAt: row.created_at as string,
    })),
  };
}

export async function getAffiliateCommissions(
  affiliateId: string,
): Promise<AffiliateCommission[]> {
  const service = createServiceClient();
  if (!service) return [];

  const { data, error } = await service
    .from("affiliate_commissions")
    .select("*")
    .eq("affiliate_id", affiliateId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(mapCommission);
}

function emptyStats(
  referralCode: string,
  partner: AffiliatePartner,
): AffiliateDashboardStats {
  return {
    referralCode,
    totalClicks: 0,
    weekClicks: 0,
    totalLeads: 0,
    weekLeads: 0,
    monthLeads: 0,
    commissionCplHkd: partner.commissionCplHkd,
    paidTotalHkd: 0,
    recentLeads: [],
  };
}

export async function createAffiliateCommissionSettlement(
  supabase: SupabaseClient,
  affiliateId: string,
  input: {
    periodLabel: string;
    leadCount: number;
    amountHkd: number;
    notes?: string;
    markPaid?: boolean;
  },
): Promise<boolean> {
  const { error } = await supabase.from("affiliate_commissions").insert({
    affiliate_id: affiliateId,
    period_label: input.periodLabel,
    lead_count: input.leadCount,
    amount_hkd: input.amountHkd,
    status: input.markPaid ? "paid" : "pending",
    notes: input.notes ?? null,
    paid_at: input.markPaid ? new Date().toISOString() : null,
  });

  return !error;
}
