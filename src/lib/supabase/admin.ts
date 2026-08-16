import type { SupabaseClient } from "@supabase/supabase-js";
import { adminErr, adminOk, type AdminQueryResult } from "@/lib/admin/query-result";
import { deleteR2Object } from "@/lib/r2/client";
import { AFFILIATE_HK_COUNTRY } from "@/lib/affiliate/hk-traffic";
import { deleteMediaByEntity } from "@/lib/supabase/media";
import { createServiceClient } from "@/lib/supabase/service";
import type {
  AdminCampaignInput,
  AdminClickStats,
  AdminDashboardStats,
  AdminLead,
  AdminMember,
  AdminMemberInput,
  AdminProductInput,
  AffiliateCommission,
  AffiliatePartner,
  AffiliatePartnerPerformanceStats,
  AffiliateTopPerformer,
  AdminAffiliateInput,
  AdminBlogInput,
  BlogFaqItem,
  BlogPost,
  Campaign,
  LoanCategory,
  Product,
} from "@/types";

const LEAD_COLUMNS =
  "id, name, phone, email, loan_amount, loan_category, product_id, source, status, notes, user_id, referral_code, created_at";

export interface AdminLeadInput {
  name: string;
  phone: string;
  email?: string | null;
  loanAmount?: number | null;
  loanCategory?: LoanCategory | null;
  productId?: string | null;
  source?: string;
  status?: AdminLead["status"];
  notes?: string | null;
  referralCode?: string | null;
  userId?: string | null;
}

export interface AdminLeadsQueryOptions {
  status?: string;
  source?: string;
  search?: string;
  referralCode?: string;
  page?: number;
  pageSize?: number;
  limit?: number;
}

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

export async function queryAdminLeads(
  supabase: SupabaseClient,
  options?: AdminLeadsQueryOptions,
): Promise<AdminQueryResult<{ leads: AdminLead[]; total: number }>> {
  const pageSize = options?.pageSize ?? options?.limit ?? 20;
  const page = options?.page ?? 1;
  const usePagination = !options?.limit || options.page != null;
  const from = usePagination ? (page - 1) * pageSize : 0;
  const to = usePagination ? from + pageSize - 1 : (options?.limit ?? 20) - 1;

  let query = supabase
    .from("leads")
    .select(LEAD_COLUMNS, { count: "exact" })
    .order("created_at", { ascending: false });

  if (options?.status && options.status !== "all") {
    query = query.eq("status", options.status);
  }

  if (options?.source && options.source !== "all") {
    query = query.eq("source", options.source);
  }

  if (options?.search?.trim()) {
    const term = options.search.trim().replace(/[%_,]/g, "");
    if (term) {
      query = query.or(
        `name.ilike.%${term}%,phone.ilike.%${term}%,email.ilike.%${term}%`,
      );
    }
  }

  if (options?.referralCode?.trim()) {
    query = query.eq(
      "referral_code",
      options.referralCode.trim().toUpperCase(),
    );
  }

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    return adminErr(error.message);
  }

  return adminOk({
    leads: (data ?? []).map(mapLead),
    total: count ?? 0,
  });
}

export async function getAdminLeads(
  supabase: SupabaseClient,
  options?: AdminLeadsQueryOptions,
): Promise<AdminLead[]> {
  const result = await queryAdminLeads(supabase, {
    ...options,
    pageSize: options?.limit ?? 1000,
    page: 1,
  });
  return result.data?.leads ?? [];
}

export async function getAdminLeadById(
  supabase: SupabaseClient,
  id: string,
): Promise<AdminQueryResult<AdminLead>> {
  const { data, error } = await supabase
    .from("leads")
    .select(LEAD_COLUMNS)
    .eq("id", id)
    .single();

  if (error) return adminErr(error.message);
  return adminOk(mapLead(data));
}

export async function queryAdminDashboardStats(
  supabase: SupabaseClient,
): Promise<AdminQueryResult<AdminDashboardStats>> {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - 7);

  const [
    { count: total, error: totalError },
    { count: todayNew, error: todayError },
    { count: weekTotal, error: weekError },
    { count: pending, error: pendingError },
    { count: closedWon, error: wonError },
    { data: sourceRows, error: sourceError },
  ] = await Promise.all([
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfToday.toISOString()),
    supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfWeek.toISOString()),
    supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .in("status", ["new", "contacted"]),
    supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("status", "closed_won"),
    supabase.from("leads").select("source"),
  ]);

  const error =
    totalError?.message ??
    todayError?.message ??
    weekError?.message ??
    pendingError?.message ??
    wonError?.message ??
    sourceError?.message;

  if (error) return adminErr(error);

  const bySource: Record<string, number> = {};
  for (const row of sourceRows ?? []) {
    const source = (row.source as string) || "website";
    bySource[source] = (bySource[source] ?? 0) + 1;
  }

  const totalCount = total ?? 0;
  const conversionRate =
    totalCount > 0
      ? Math.round(((closedWon ?? 0) / totalCount) * 100)
      : 0;

  return adminOk({
    todayNew: todayNew ?? 0,
    pending: pending ?? 0,
    weekTotal: weekTotal ?? 0,
    conversionRate,
    total: totalCount,
    bySource,
  });
}

export async function getAdminDashboardStats(
  supabase: SupabaseClient,
): Promise<AdminDashboardStats> {
  const result = await queryAdminDashboardStats(supabase);
  return (
    result.data ?? {
      todayNew: 0,
      pending: 0,
      weekTotal: 0,
      conversionRate: 0,
      total: 0,
      bySource: {},
    }
  );
}

export async function updateAdminLead(
  supabase: SupabaseClient,
  id: string,
  updates: Partial<AdminLeadInput>,
): Promise<{ ok: boolean; error?: string }> {
  const payload: Record<string, unknown> = {};

  if (updates.name !== undefined) payload.name = updates.name.trim();
  if (updates.phone !== undefined) payload.phone = updates.phone.trim();
  if (updates.email !== undefined) payload.email = updates.email?.trim() || null;
  if (updates.loanAmount !== undefined) payload.loan_amount = updates.loanAmount;
  if (updates.loanCategory !== undefined) payload.loan_category = updates.loanCategory;
  if (updates.productId !== undefined) payload.product_id = updates.productId;
  if (updates.source !== undefined) payload.source = updates.source;
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.notes !== undefined) payload.notes = updates.notes;
  if (updates.referralCode !== undefined) {
    payload.referral_code = updates.referralCode?.trim().toUpperCase() || null;
  }
  if (updates.userId !== undefined) payload.user_id = updates.userId;

  if (Object.keys(payload).length === 0) {
    return { ok: true };
  }

  const { error } = await supabase.from("leads").update(payload).eq("id", id);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function createAdminLead(
  supabase: SupabaseClient,
  input: AdminLeadInput,
): Promise<AdminQueryResult<AdminLead>> {
  const { data, error } = await supabase
    .from("leads")
    .insert({
      name: input.name.trim(),
      phone: input.phone.trim(),
      email: input.email?.trim() || null,
      loan_amount: input.loanAmount ?? null,
      loan_category: input.loanCategory ?? null,
      product_id: input.productId ?? null,
      source: input.source?.trim() || "admin_manual",
      status: input.status ?? "new",
      notes: input.notes?.trim() || null,
      referral_code: input.referralCode?.trim().toUpperCase() || null,
      user_id: input.userId ?? null,
    })
    .select(LEAD_COLUMNS)
    .single();

  if (error) return adminErr(error.message);
  return adminOk(mapLead(data));
}

export async function deleteAdminLead(
  supabase: SupabaseClient,
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  const media = await deleteMediaByEntity(supabase, "lead", id);
  if (media.error) return { ok: false, error: media.error };

  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  await Promise.all(
    media.assets.map((asset) => deleteR2Object(asset.objectKey)),
  );

  return { ok: true };
}

export async function countPendingAffiliatePartners(
  supabase: SupabaseClient,
): Promise<number> {
  const { count, error } = await supabase
    .from("affiliate_partners")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  if (error) return 0;
  return count ?? 0;
}

function mapAffiliateCommission(row: Record<string, unknown>): AffiliateCommission {
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

export async function getAffiliateCommissions(
  supabase: SupabaseClient,
  affiliateId: string,
): Promise<AffiliateCommission[]> {
  const { data, error } = await supabase
    .from("affiliate_commissions")
    .select("*")
    .eq("affiliate_id", affiliateId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(mapAffiliateCommission);
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
    imageSizePreset:
      (row.image_size_preset as Product["imageSizePreset"]) ?? "md",
    imageDisplayWidth: (row.image_display_width as number | null) ?? undefined,
    imageDisplayHeight:
      (row.image_display_height as number | null) ?? undefined,
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
    image_size_preset: input.imageSizePreset ?? "md",
    image_display_width: input.imageDisplayWidth ?? null,
    image_display_height: input.imageDisplayHeight ?? null,
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

function mapBlogPost(row: Record<string, unknown>): BlogPost {
  const faqRaw = row.faq as BlogFaqItem[] | null;

  return {
    slug: row.slug as string,
    title: row.title as string,
    excerpt: row.excerpt as string,
    metaDescription: row.meta_description as string,
    keywords: (row.keywords as string[]) ?? [],
    category: row.category as BlogPost["category"],
    body: row.body as string,
    faq: faqRaw ?? [],
    readingMinutes: row.reading_minutes as number,
    isActive: row.is_active as boolean,
    publishedAt: row.published_at as string,
    updatedAt: row.updated_at as string,
  };
}

function blogToRow(input: AdminBlogInput) {
  return {
    slug: input.slug.trim(),
    title: input.title.trim(),
    excerpt: input.excerpt.trim(),
    meta_description: input.metaDescription.trim(),
    keywords: input.keywords,
    category: input.category,
    body: input.body,
    faq: input.faq,
    reading_minutes: input.readingMinutes,
    is_active: input.isActive,
    published_at: input.publishedAt,
    updated_at: new Date().toISOString(),
  };
}

export async function getAdminBlogPosts(
  supabase: SupabaseClient,
): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("published_at", { ascending: false });

  if (error || !data) return [];
  return data.map(mapBlogPost);
}

export async function getAdminBlogPostBySlug(
  supabase: SupabaseClient,
  slug: string,
): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return mapBlogPost(data);
}

export async function upsertAdminBlogPost(
  supabase: SupabaseClient,
  input: AdminBlogInput,
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase
    .from("blog_posts")
    .upsert(blogToRow(input), { onConflict: "slug" });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function deactivateAdminBlogPost(
  supabase: SupabaseClient,
  slug: string,
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase
    .from("blog_posts")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("slug", slug);

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

export async function updateAdminMember(
  supabase: SupabaseClient,
  id: string,
  input: AdminMemberInput,
): Promise<{ ok: boolean; error?: string }> {
  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.fullName !== undefined) {
    patch.full_name = input.fullName?.trim() || null;
  }
  if (input.phone !== undefined) {
    patch.phone = input.phone?.trim() || null;
  }
  if (input.role !== undefined) {
    patch.role = input.role;
  }

  const { error } = await supabase.from("profiles").update(patch).eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function deleteAdminMember(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  const service = createServiceClient();
  if (!service) return { ok: false, error: "伺服器設定錯誤" };

  const { error } = await service.auth.admin.deleteUser(id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
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
        .select("product_id, campaign_id, source, referral_code, created_at")
        .eq("country_code", AFFILIATE_HK_COUNTRY)
        .eq("counts_for_stats", true),
      supabase
        .from("leads")
        .select("referral_code")
        .eq("country_code", AFFILIATE_HK_COUNTRY)
        .eq("counts_for_stats", true)
        .not("referral_code", "is", null),
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
    if (ref) {
      clickByReferral[ref] = (clickByReferral[ref] ?? 0) + 1;
    }

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
      if (ref) {
        leadByReferral[ref] = (leadByReferral[ref] ?? 0) + 1;
      }
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
  const result = await queryAdminAffiliatePartners(supabase, {
    status,
    page: 1,
    pageSize: 1000,
  });
  return result.data?.partners ?? [];
}

export interface AdminAffiliatesQueryOptions {
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: AffiliatePartnerSort;
}

export type AffiliatePartnerSort =
  | "newest"
  | "week_leads"
  | "total_leads"
  | "total_clicks"
  | "conversion";

const AFFILIATE_PERFORMANCE_SORTS: AffiliatePartnerSort[] = [
  "week_leads",
  "total_leads",
  "total_clicks",
  "conversion",
];

function emptyPartnerStats(): AffiliatePartnerPerformanceStats {
  return {
    totalClicks: 0,
    weekClicks: 0,
    totalLeads: 0,
    weekLeads: 0,
    monthLeads: 0,
    conversionRate: null,
  };
}

function normalizeReferralCodes(codes: string[]): string[] {
  return [...new Set(codes.map((c) => c.trim().toUpperCase()).filter(Boolean))];
}

export async function getAdminAffiliatePerformanceStats(
  supabase: SupabaseClient,
  referralCodes: string[],
): Promise<Record<string, AffiliatePartnerPerformanceStats>> {
  const codes = normalizeReferralCodes(referralCodes);
  const stats: Record<string, AffiliatePartnerPerformanceStats> = {};
  for (const code of codes) {
    stats[code] = emptyPartnerStats();
  }
  if (codes.length === 0) return stats;

  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - 7);
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [{ data: clicks, error: clickError }, { data: leads, error: leadError }] =
    await Promise.all([
      supabase
        .from("affiliate_clicks")
        .select("referral_code, created_at")
        .eq("country_code", AFFILIATE_HK_COUNTRY)
        .eq("counts_for_stats", true)
        .in("referral_code", codes),
      supabase
        .from("leads")
        .select("referral_code, created_at")
        .eq("country_code", AFFILIATE_HK_COUNTRY)
        .eq("counts_for_stats", true)
        .in("referral_code", codes),
    ]);

  if (!clickError && clicks) {
    for (const row of clicks) {
      const code = (row.referral_code as string | null)?.trim().toUpperCase();
      if (!code || !stats[code]) continue;
      stats[code].totalClicks += 1;
      if (new Date(row.created_at as string) >= startOfWeek) {
        stats[code].weekClicks += 1;
      }
    }
  }

  if (!leadError && leads) {
    for (const row of leads) {
      const code = (row.referral_code as string | null)?.trim().toUpperCase();
      if (!code || !stats[code]) continue;
      stats[code].totalLeads += 1;
      const created = new Date(row.created_at as string);
      if (created >= startOfWeek) stats[code].weekLeads += 1;
      if (created >= startOfMonth) stats[code].monthLeads += 1;
    }
  }

  for (const code of codes) {
    const s = stats[code];
    s.conversionRate =
      s.totalClicks > 0
        ? Math.round((s.totalLeads / s.totalClicks) * 1000) / 10
        : null;
  }

  return stats;
}

export async function countAffiliateLeadsForPeriod(
  supabase: SupabaseClient,
  referralCode: string,
  periodLabel: string,
): Promise<number> {
  const match = /^(\d{4})-(\d{2})$/.exec(periodLabel.trim());
  if (!match) return 0;

  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) return 0;

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  const { count, error } = await supabase
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("referral_code", referralCode.trim().toUpperCase())
    .eq("country_code", AFFILIATE_HK_COUNTRY)
    .eq("counts_for_stats", true)
    .gte("created_at", start.toISOString())
    .lt("created_at", end.toISOString());

  if (error) return 0;
  return count ?? 0;
}

export async function getAdminAffiliateTopPerformers(
  supabase: SupabaseClient,
  limit = 5,
): Promise<AffiliateTopPerformer[]> {
  const { data, error } = await supabase
    .from("affiliate_partners")
    .select("name, referral_code")
    .eq("status", "approved")
    .not("referral_code", "is", null);

  if (error || !data?.length) return [];

  const partners = data.map((row) => ({
    name: row.name as string,
    code: (row.referral_code as string).trim().toUpperCase(),
  }));

  const statsByCode = await getAdminAffiliatePerformanceStats(
    supabase,
    partners.map((p) => p.code),
  );

  return partners
    .map((p) => ({
      referralCode: p.code,
      partnerName: p.name,
      weekLeads: statsByCode[p.code]?.weekLeads ?? 0,
      weekClicks: statsByCode[p.code]?.weekClicks ?? 0,
      totalLeads: statsByCode[p.code]?.totalLeads ?? 0,
    }))
    .filter((p) => p.weekLeads > 0 || p.weekClicks > 0 || p.totalLeads > 0)
    .sort((a, b) => b.weekLeads - a.weekLeads || b.totalLeads - a.totalLeads)
    .slice(0, limit);
}

function sortAffiliatePartnersByPerformance(
  partners: AffiliatePartner[],
  statsByCode: Record<string, AffiliatePartnerPerformanceStats>,
  sort: AffiliatePartnerSort,
): AffiliatePartner[] {
  if (sort === "newest") return partners;

  const copy = [...partners];
  copy.sort((a, b) => {
    const codeA = a.referralCode?.toUpperCase() ?? "";
    const codeB = b.referralCode?.toUpperCase() ?? "";
    const sa = statsByCode[codeA] ?? emptyPartnerStats();
    const sb = statsByCode[codeB] ?? emptyPartnerStats();

    switch (sort) {
      case "week_leads":
        return sb.weekLeads - sa.weekLeads || sb.totalLeads - sa.totalLeads;
      case "total_leads":
        return sb.totalLeads - sa.totalLeads || sb.totalClicks - sa.totalClicks;
      case "total_clicks":
        return sb.totalClicks - sa.totalClicks || sb.totalLeads - sa.totalLeads;
      case "conversion":
        return (
          (sb.conversionRate ?? -1) - (sa.conversionRate ?? -1) ||
          sb.totalLeads - sa.totalLeads
        );
      default:
        return 0;
    }
  });
  return copy;
}

async function fetchAllAdminAffiliatePartners(
  supabase: SupabaseClient,
  options?: Pick<AdminAffiliatesQueryOptions, "status" | "search">,
): Promise<AffiliatePartner[]> {
  let query = supabase
    .from("affiliate_partners")
    .select("*")
    .order("created_at", { ascending: false });

  if (options?.status && options.status !== "all") {
    query = query.eq("status", options.status);
  }

  if (options?.search?.trim()) {
    const term = options.search.trim().replace(/[%_,]/g, "");
    if (term) {
      query = query.or(
        `name.ilike.%${term}%,phone.ilike.%${term}%,email.ilike.%${term}%,referral_code.ilike.%${term}%`,
      );
    }
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return data.map(mapAffiliatePartner);
}

export async function queryAdminAffiliatePartnersPage(
  supabase: SupabaseClient,
  options?: AdminAffiliatesQueryOptions,
): Promise<
  AdminQueryResult<{
    partners: AffiliatePartner[];
    total: number;
    statsByCode: Record<string, AffiliatePartnerPerformanceStats>;
  }>
> {
  const pageSize = options?.pageSize ?? 20;
  const page = options?.page ?? 1;
  const sort = options?.sort ?? "newest";
  const usePerformanceSort = AFFILIATE_PERFORMANCE_SORTS.includes(sort);

  if (usePerformanceSort) {
    const allPartners = await fetchAllAdminAffiliatePartners(supabase, options);
    const codes = allPartners
      .map((p) => p.referralCode)
      .filter((c): c is string => Boolean(c));
    const statsByCode = await getAdminAffiliatePerformanceStats(supabase, codes);
    const sorted = sortAffiliatePartnersByPerformance(allPartners, statsByCode, sort);
    const from = (page - 1) * pageSize;
    return adminOk({
      partners: sorted.slice(from, from + pageSize),
      total: sorted.length,
      statsByCode,
    });
  }

  const result = await queryAdminAffiliatePartners(supabase, options);
  if (result.error || !result.data) {
    return adminErr(result.error ?? "查詢失敗");
  }

  const codes = result.data.partners
    .map((p) => p.referralCode)
    .filter((c): c is string => Boolean(c));
  const statsByCode = await getAdminAffiliatePerformanceStats(supabase, codes);

  return adminOk({
    partners: result.data.partners,
    total: result.data.total,
    statsByCode,
  });
}

export async function queryAdminAffiliatePartners(
  supabase: SupabaseClient,
  options?: AdminAffiliatesQueryOptions,
): Promise<AdminQueryResult<{ partners: AffiliatePartner[]; total: number }>> {
  const pageSize = options?.pageSize ?? 20;
  const page = options?.page ?? 1;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("affiliate_partners")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (options?.status && options.status !== "all") {
    query = query.eq("status", options.status);
  }

  if (options?.search?.trim()) {
    const term = options.search.trim().replace(/[%_,]/g, "");
    if (term) {
      query = query.or(
        `name.ilike.%${term}%,phone.ilike.%${term}%,email.ilike.%${term}%,referral_code.ilike.%${term}%`,
      );
    }
  }

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    return adminErr(error.message);
  }

  return adminOk({
    partners: (data ?? []).map(mapAffiliatePartner),
    total: count ?? 0,
  });
}

export async function getAdminAffiliatePartnerById(
  supabase: SupabaseClient,
  id: string,
): Promise<AffiliatePartner | null> {
  const { data, error } = await supabase
    .from("affiliate_partners")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return mapAffiliatePartner(data);
}

export async function createAdminAffiliatePartner(
  supabase: SupabaseClient,
  input: AdminAffiliateInput,
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const { data, error } = await supabase
    .from("affiliate_partners")
    .insert({
      name: input.name.trim(),
      phone: input.phone.trim(),
      email: input.email?.trim().toLowerCase() || null,
      channel: input.channel?.trim() || null,
      website: input.website?.trim() || null,
      audience: input.audience?.trim() || null,
      referral_code: input.referralCode?.trim().toUpperCase() || null,
      commission_cpl_hkd: input.commissionCplHkd ?? null,
      status: input.status ?? "pending",
      notes: input.notes?.trim() || null,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };
  return { ok: true, id: data.id as string };
}

export async function deleteAdminAffiliatePartner(
  supabase: SupabaseClient,
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase
    .from("affiliate_partners")
    .delete()
    .eq("id", id);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** 批准後以 email 綁定現有會員帳戶 */
export async function linkAffiliatePartnerUserByEmail(
  partnerId: string,
  email: string,
): Promise<void> {
  const service = createServiceClient();
  if (!service) return;

  const normalized = email.trim().toLowerCase();
  const { data: profile } = await service
    .from("profiles")
    .select("id")
    .ilike("email", normalized)
    .maybeSingle();

  if (!profile) return;

  await service
    .from("affiliate_partners")
    .update({ user_id: profile.id })
    .eq("id", partnerId)
    .is("user_id", null);
}

export async function updateAffiliatePartner(
  supabase: SupabaseClient,
  id: string,
  updates: {
    name?: string;
    phone?: string;
    email?: string | null;
    channel?: string | null;
    website?: string | null;
    audience?: string | null;
    status?: AffiliatePartner["status"];
    referralCode?: string | null;
    notes?: string | null;
    commissionCplHkd?: number | null;
  },
): Promise<{ ok: boolean; error?: string }> {
  const payload: Record<string, unknown> = {};
  if (updates.name !== undefined) payload.name = updates.name.trim();
  if (updates.phone !== undefined) payload.phone = updates.phone.trim();
  if (updates.email !== undefined) {
    payload.email = updates.email?.trim().toLowerCase() || null;
  }
  if (updates.channel !== undefined) payload.channel = updates.channel;
  if (updates.website !== undefined) payload.website = updates.website;
  if (updates.audience !== undefined) payload.audience = updates.audience;
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

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
