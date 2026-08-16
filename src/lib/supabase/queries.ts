import { campaigns as staticCampaigns } from "@/data/campaigns";
import { products as staticProducts } from "@/data/products";
import type { Campaign, Product } from "@/types";
import { createClient } from "./server";

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();

  if (!supabase) {
    return staticProducts.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return staticProducts.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    provider: row.provider,
    category: row.category,
    tagline: row.tagline,
    apr: row.apr,
    monthlyFlat: row.monthly_flat ?? undefined,
    maxAmount: row.max_amount,
    maxTermMonths: row.max_term_months,
    features: row.features ?? [],
    badges: row.badges ?? [],
    exclusiveOffer: row.exclusive_offer ?? undefined,
    applyUrl: row.apply_url ?? undefined,
    imageUrl: row.image_url ?? undefined,
    imageSizePreset: row.image_size_preset ?? "md",
    imageDisplayWidth: row.image_display_width ?? undefined,
    imageDisplayHeight: row.image_display_height ?? undefined,
    isFeatured: row.is_featured,
    sortOrder: row.sort_order,
  }));
}

export async function getCampaigns(): Promise<Campaign[]> {
  const supabase = await createClient();

  if (!supabase) {
    return staticCampaigns
      .filter((c) => c.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return staticCampaigns
      .filter((c) => c.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    ctaText: row.cta_text,
    ctaHref: row.cta_href,
    badge: row.badge ?? undefined,
    expiresAt: row.expires_at ?? undefined,
    imageUrl: row.image_url ?? undefined,
    isActive: row.is_active,
    sortOrder: row.sort_order,
  }));
}
