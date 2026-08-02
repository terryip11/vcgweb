import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AdminCampaignInput,
  AdminClickStats,
  AdminDashboardStats,
  AdminLead,
  AdminMember,
  AdminProductInput,
  AffiliatePartner,
  Campaign,
  Product,
} from "@/types";

function mapLead(row: Record<string, unknown>): AdminLead {
  return {
    id: row.id as string,
    name: row.name as string,
    phone: row.phone as string,
    email: (row.email as string | null) ?? undefined,
    loanAmount: (row.loan_amount as number | null) ?? undefined,
    loanCategory: (row.loan_category as AdminLead["loanCategory"]) ?? undefined,
    productId: (row.product_id as string | null) ?? undefined,
    source: (row.source as string | null) ?? "website",
    status: row.status as AdminLead["status"],
    notes: (row.notes as string | null) ?? undefined,
    userId: (row.user_id as string | null) ?? undefined,
    referralCode: (row.referral_code as string | null) ?? undefined,
    createdAt: row.created_at as string,
  };
}

export async function getAdminLeads(
  supabase: SupabaseClient,
  options?: {
    status?: string;
    source?: string;
    search?: string;
    limit?: number;
  },
): Promise<AdminLead[]> {
  let query = supabase
    .from("leads")
    .select(
      "id, name, phone, email, loan_amount, loan_category, product_id, source, status, notes, user_id, referral_code, created_at",
    )
    .order("created_at", { ascending: false });

  if (options?.status && options.status !== "all") {
    query = query.eq("status", options.status);
  }

  if (options?.source && options.source !== "all") {
    query = query.eq("source", options.source);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  let leads = data.map(mapLead);

  if (options?.search?.trim()) {
    const q = options.search.trim().toLowerCase();
    leads = leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(q) ||
        lead.phone.includes(q) ||
        lead.email?.toLowerCase().includes(q),
    );
  }

  return leads;
}

export async function getAdminLeadById(
  supabase: SupabaseClient,
  id: string,
): Promise<AdminLead | null> {
  const { data, error } = await supabase
    .from("leads")
    .select(
      "id, name, phone, email, loan_amount, loan_category, product_id, source, status, notes, user_id, referral_code, created_at",
    )
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return mapLead(data);
}

export async function getAdminDashboardStats(
  supabase: SupabaseClient,
): Promise<AdminDashboardStats> {
  const { data, error } = await supabase
    .from("leads")
    .select("status, created_at, source");

  if (error || !data) {
    return {
      todayNew: 0,
      pending: 0,
      weekTotal: 0,
      conversionRate: 0,
      total: 0,
      bySource: {},
    };
  }

  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - 7);

  let todayNew = 0;
  let pending = 0;
  let weekTotal = 0;
  let closedWon = 0;
  const bySource: Record<string, number> = {};

  for (const row of data) {
    const created = new Date(row.created_at as string);
    const status = row.status as string;
    const source = (row.source as string) || "website";

    bySource[source] = (bySource[source] ?? 0) + 1;

    if (created >= startOfToday) todayNew += 1;
    if (created >= startOfWeek) weekTotal += 1;
    if (status === "new" || status === "contacted") pending += 1;
    if (status === "closed_won") closedWon += 1;
  }

  const total = data.length;
  const conversionRate =
    total > 0 ? Math.round((closedWon / total) * 100) : 0;

  return {
    todayNew,
    pending,
    weekTotal,
    conversionRate,
    total,
    bySource,
  };
}

export async function updateAdminLead(
  supabase: SupabaseClient,
  id: string,
  updates: { status?: string; notes?: string | null },
): Promise<{ ok: boolean; error?: string }> {
  const payload: Record<string, string | null> = {};
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.notes !== undefined) payload.notes = updates.notes;

  const { error } = await supabase.from("leads").update(payload).eq("id", id);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    provider: row.provider as string,
    category: row.category as Product["category"],
    tagline: row.tagline as string,
    apr: Number(row.apr),
    monthlyFlat: (row.monthly_flat as number | null) ?? undefined,
    maxAmount: row.max_amount as number,
    maxTermMonths: row.max_term_months as number,
    features: (row.features as string[]) ?? [],
    badges: (row.badges as string[]) ?? [],
    exclusiveOffer: (row.exclusive_offer as string | null) ?? undefined,
    applyUrl: (row.apply_url as string | null) ?? undefined,
    imageUrl: (row.image_url as string | null) ?? undefined,
    isFeatured: row.is_featured as boolean,
    isActive: row.is_active as boolean,
    sortOrder: row.sort_order as number,
  };
}

function mapCampaign(row: Record<string, unknown>): Campaign {
  return {
    id: row.id as string,
    title: row.title as string,
    subtitle: row.subtitle as string,
    ctaText: row.cta_text as string,
    ctaHref: row.cta_href as string,
    badge: (row.badge as string | null) ?? undefined,
    expiresAt: (row.expires_at as string | null) ?? undefined,
    imageUrl: (row.image_url as string | null) ?? undefined,
    isActive: row.is_active as boolean,
    sortOrder: row.sort_order as number,
  };
}

function productToRow(input: AdminProductInput) {
  return {
    id: input.id.trim(),
    name: input.name.trim(),
    provider: input.provider.trim(),
    category: input.category,
    tagline: input.tagline.trim(),
    apr: input.apr,
    monthly_flat: input.monthlyFlat ?? null,
    max_amount: input.maxAmount,
    max_term_months: input.maxTermMonths,
    features: input.features,
    badges: input.badges,
    exclusive_offer: input.exclusiveOffer?.trim() || null,
    apply_url: input.applyUrl?.trim() || null,
    image_url: input.imageUrl?.trim() || null,
    is_featured: input.isFeatured,
    is_active: input.isActive,
    sort_order: input.sortOrder,
    updated_at: new Date().toISOString(),
  };
}

function campaignToRow(input: AdminCampaignInput) {
  return {
    id: input.id.trim(),
    title: input.title.trim(),
    subtitle: input.subtitle.trim(),
    cta_text: input.ctaText.trim(),
    cta_href: input.ctaHref.trim(),
    badge: input.badge?.trim() || null,
    expires_at: input.expiresAt || null,
    image_url: input.imageUrl?.trim() || null,
    is_active: input.isActive,
    sort_order: input.sortOrder,
    updated_at: new Date().toISOString(),
  };
}

export async function getAdminProducts(
  supabase: SupabaseClient,
): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data.map(mapProduct);
}

export async function getAdminProductById(
  supabase: SupabaseClient,
  id: string,
): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return mapProduct(data);
}

export async function upsertAdminProduct(
  supabase: SupabaseClient,
  input: AdminProductInput,
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase
    .from("products")
    .upsert(productToRow(input), { onConflict: "id" });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function deactivateAdminProduct(
  supabase: SupabaseClient,
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase
    .from("products")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function getAdminCampaigns(
  supabase: SupabaseClient,
): Promise<Campaign[]> {
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data.map(mapCampaign);
}

export async function getAdminCampaignById(
  supabase: SupabaseClient,
  id: string,
): Promise<Campaign | null> {
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return mapCampaign(data);
}

export async function upsertAdminCampaign(
  supabase: SupabaseClient,
  input: AdminCampaignInput,
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase
    .from("campaigns")
    .upsert(campaignToRow(input), { onConflict: "id" });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function deactivateAdminCampaign(
  supabase: SupabaseClient,
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase
    .from("campaigns")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function getAdminMembers(
  supabase: SupabaseClient,
): Promise<AdminMember[]> {
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, avatar_url, phone, role, created_at")
    .order("created_at", { ascending: false });

  if (error || !profiles) return [];

  const { data: leadCounts } = await supabase
    .from("leads")
    .select("user_id");

  const countMap: Record<string, number> = {};
  for (const row of leadCounts ?? []) {
    if (row.user_id) {
      countMap[row.user_id] = (countMap[row.user_id] ?? 0) + 1;
    }
  }

  return profiles.map((row) => ({
    id: row.id,
    email: row.email ?? undefined,
    fullName: row.full_name ?? undefined,
    avatarUrl: row.avatar_url ?? undefined,
    phone: row.phone ?? undefined,
    role: (row.role as AdminMember["role"]) ?? "member",
    leadCount: countMap[row.id] ?? 0,
    createdAt: row.created_at,
  }));
}

export async function getAdminMemberById(
  supabase: SupabaseClient,
  id: string,
): Promise<AdminMember | null> {
  const members = await getAdminMembers(supabase);
  return members.find((m) => m.id === id) ?? null;
}

export async function getAdminLeadsByUserId(
  supabase: SupabaseClient,
  userId: string,
): Promise<AdminLead[]> {
  const { data, error } = await supabase
    .from("leads")
    .select(
      "id, name, phone, email, loan_amount, loan_category, product_id, source, status, notes, user_id, referral_code, created_at",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(mapLead);
}

export async function getAdminClickStats(
  supabase: SupabaseClient,
): Promise<AdminClickStats> {
  const [{ data: clicks, error: clickError }, { data: leads, error: leadError }] =
    await Promise.all([
      supabase
        .from("affiliate_clicks")
        .select("product_id, campaign_id, source, referral_code, created_at"),
      supabase.from("leads").select("referral_code"),
    ]);

  if (clickError || !clicks) {
    return {
      total: 0,
      weekTotal: 0,
      byProduct: [],
      byCampaign: [],
      bySource: {},
      byReferral: [],
    };
  }

  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - 7);

  const productCounts: Record<string, number> = {};
  const campaignCounts: Record<string, number> = {};
  const bySource: Record<string, number> = {};
  const clickByReferral: Record<string, number> = {};
  let weekTotal = 0;

  for (const row of clicks) {
    const created = new Date(row.created_at as string);
    if (created >= startOfWeek) weekTotal += 1;

    const source = (row.source as string) || "website";
    bySource[source] = (bySource[source] ?? 0) + 1;

    const ref = (row.referral_code as string | null)?.trim().toUpperCase();
    if (ref) clickByReferral[ref] = (clickByReferral[ref] ?? 0) + 1;

    if (row.product_id) {
      productCounts[row.product_id as string] =
        (productCounts[row.product_id as string] ?? 0) + 1;
    }
    if (row.campaign_id) {
      campaignCounts[row.campaign_id as string] =
        (campaignCounts[row.campaign_id as string] ?? 0) + 1;
    }
  }

  const leadByReferral: Record<string, number> = {};
  if (!leadError && leads) {
    for (const row of leads) {
      const ref = (row.referral_code as string | null)?.trim().toUpperCase();
      if (ref) leadByReferral[ref] = (leadByReferral[ref] ?? 0) + 1;
    }
  }

  const referralCodes = new Set([
    ...Object.keys(clickByReferral),
    ...Object.keys(leadByReferral),
  ]);

  const byReferral = [...referralCodes]
    .map((code) => ({
      code,
      clicks: clickByReferral[code] ?? 0,
      leads: leadByReferral[code] ?? 0,
    }))
    .sort((a, b) => b.leads + b.clicks - (a.leads + a.clicks));

  const byProduct = Object.entries(productCounts)
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count);

  const byCampaign = Object.entries(campaignCounts)
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count);

  return {
    total: clicks.length,
    weekTotal,
    byProduct,
    byCampaign,
    bySource,
    byReferral,
  };
}

function mapAffiliatePartner(row: Record<string, unknown>): AffiliatePartner {
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

export async function getAdminAffiliatePartners(
  supabase: SupabaseClient,
  status?: string,
): Promise<AffiliatePartner[]> {
  let query = supabase
    .from("affiliate_partners")
    .select("*")
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return data.map(mapAffiliatePartner);
}

export async function updateAffiliatePartner(
  supabase: SupabaseClient,
  id: string,
  updates: {
    status?: AffiliatePartner["status"];
    referralCode?: string | null;
    notes?: string | null;
    commissionCplHkd?: number | null;
  },
): Promise<boolean> {
  const payload: Record<string, unknown> = {};
  if (updates.status) payload.status = updates.status;
  if (updates.referralCode !== undefined) {
    payload.referral_code = updates.referralCode?.trim().toUpperCase() || null;
  }
  if (updates.notes !== undefined) payload.notes = updates.notes;
  if (updates.commissionCplHkd !== undefined) {
    payload.commission_cpl_hkd = updates.commissionCplHkd;
  }
  if (updates.status === "approved") {
    payload.approved_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("affiliate_partners")
    .update(payload)
    .eq("id", id);

  return !error;
}
