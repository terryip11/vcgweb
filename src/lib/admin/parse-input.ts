import type {
  AdminCampaignInput,
  AdminProductInput,
  LoanCategory,
} from "@/types";
import { LOAN_CATEGORIES, linesToArray } from "@/lib/admin/constants";

function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).map((s) => s.trim()).filter(Boolean);
  }
  if (typeof value === "string") return linesToArray(value);
  return [];
}

export function parseProductInput(body: Record<string, unknown>): {
  input?: AdminProductInput;
  error?: string;
} {
  const id = String(body.id ?? "").trim();
  const name = String(body.name ?? "").trim();
  const provider = String(body.provider ?? "").trim();

  if (!id || !name || !provider) {
    return { error: "ID、名稱及機構為必填" };
  }

  const category = body.category as LoanCategory;
  if (!LOAN_CATEGORIES.includes(category)) {
    return { error: "無效的貸款類別" };
  }

  const apr = Number(body.apr);
  const maxAmount = Number(body.maxAmount);
  const maxTermMonths = Number(body.maxTermMonths);
  const sortOrder = Number(body.sortOrder ?? 0);

  if (Number.isNaN(apr) || Number.isNaN(maxAmount) || Number.isNaN(maxTermMonths)) {
    return { error: "APR、最高額度及期數須為數字" };
  }

  const monthlyFlatRaw = body.monthlyFlat;
  const monthlyFlat =
    monthlyFlatRaw === null || monthlyFlatRaw === "" || monthlyFlatRaw === undefined
      ? null
      : Number(monthlyFlatRaw);

  if (monthlyFlat !== null && Number.isNaN(monthlyFlat)) {
    return { error: "月平息須為數字" };
  }

  return {
    input: {
      id,
      name,
      provider,
      category,
      tagline: String(body.tagline ?? "").trim(),
      apr,
      monthlyFlat,
      maxAmount,
      maxTermMonths,
      features: parseStringArray(body.features),
      badges: parseStringArray(body.badges),
      exclusiveOffer:
        body.exclusiveOffer === null || body.exclusiveOffer === ""
          ? null
          : String(body.exclusiveOffer).trim(),
      applyUrl:
        body.applyUrl === null || body.applyUrl === ""
          ? null
          : String(body.applyUrl).trim(),
      imageUrl:
        body.imageUrl === null || body.imageUrl === ""
          ? null
          : String(body.imageUrl).trim(),
      isFeatured: Boolean(body.isFeatured),
      isActive: body.isActive !== false,
      sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
    },
  };
}

export function parseCampaignInput(body: Record<string, unknown>): {
  input?: AdminCampaignInput;
  error?: string;
} {
  const id = String(body.id ?? "").trim();
  const title = String(body.title ?? "").trim();

  if (!id || !title) {
    return { error: "ID 及標題為必填" };
  }

  const sortOrder = Number(body.sortOrder ?? 0);

  return {
    input: {
      id,
      title,
      subtitle: String(body.subtitle ?? "").trim(),
      ctaText: String(body.ctaText ?? "立即申請").trim(),
      ctaHref: String(body.ctaHref ?? "#compare").trim(),
      badge:
        body.badge === null || body.badge === ""
          ? null
          : String(body.badge).trim(),
      expiresAt:
        body.expiresAt === null || body.expiresAt === ""
          ? null
          : String(body.expiresAt),
      imageUrl:
        body.imageUrl === null || body.imageUrl === ""
          ? null
          : String(body.imageUrl).trim(),
      isActive: body.isActive !== false,
      sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
    },
  };
}
