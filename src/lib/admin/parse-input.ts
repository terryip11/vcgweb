import type {
  AdminCampaignInput,
  AdminBlogInput,
  AdminProductInput,
  BlogCategory,
  BlogFaqItem,
  LoanCategory,
  ProductImageSizePreset,
} from "@/types";
import { LOAN_CATEGORIES, linesToArray } from "@/lib/admin/constants";

function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).map((s) => s.trim()).filter(Boolean);
  }
  if (typeof value === "string") return linesToArray(value);
  return [];
}

const IMAGE_SIZE_PRESETS = new Set([
  "sm",
  "md",
  "lg",
  "wide",
  "tall",
  "custom",
]);

function parseImageSizePreset(value: unknown): ProductImageSizePreset {
  const preset = String(value ?? "md");
  return IMAGE_SIZE_PRESETS.has(preset)
    ? (preset as ProductImageSizePreset)
    : "md";
}

function parseOptionalPx(value: unknown): number | null {
  if (value === null || value === "" || value === undefined) return null;
  const n = Number(value);
  if (Number.isNaN(n)) return null;
  return Math.min(200, Math.max(24, Math.round(n)));
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
      imageSizePreset: parseImageSizePreset(body.imageSizePreset),
      imageDisplayWidth: parseOptionalPx(body.imageDisplayWidth),
      imageDisplayHeight: parseOptionalPx(body.imageDisplayHeight),
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

const BLOG_CATEGORIES = new Set([
  "guide",
  "personal",
  "sme",
  "tax",
  "owner",
  "funds",
]);

function parseFaq(value: unknown): BlogFaqItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const question = String(row.question ?? "").trim();
      const answer = String(row.answer ?? "").trim();
      if (!question || !answer) return null;
      return { question, answer };
    })
    .filter((item): item is BlogFaqItem => item !== null);
}

export function parseBlogInput(body: Record<string, unknown>): {
  input?: AdminBlogInput;
  error?: string;
} {
  const slug = String(body.slug ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
  const title = String(body.title ?? "").trim();

  if (!slug || !title) {
    return { error: "Slug 及標題為必填" };
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { error: "Slug 只能包含小寫英文、數字及連字號" };
  }

  const category = String(body.category ?? "guide");
  if (!BLOG_CATEGORIES.has(category)) {
    return { error: "無效的文章分類" };
  }

  const readingMinutes = Number(body.readingMinutes ?? 5);
  const keywordsRaw = body.keywords;
  const keywords = Array.isArray(keywordsRaw)
    ? keywordsRaw.map(String).map((s) => s.trim()).filter(Boolean)
    : String(keywordsRaw ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

  const publishedAtRaw = String(body.publishedAt ?? "").trim();
  const publishedAt = publishedAtRaw
    ? new Date(publishedAtRaw).toISOString()
    : new Date().toISOString();

  if (publishedAtRaw && Number.isNaN(new Date(publishedAtRaw).getTime())) {
    return { error: "發佈日期格式不正確" };
  }

  return {
    input: {
      slug,
      title,
      excerpt: String(body.excerpt ?? "").trim(),
      metaDescription: String(body.metaDescription ?? body.excerpt ?? "").trim(),
      keywords,
      category: category as BlogCategory,
      body: String(body.body ?? ""),
      faq: parseFaq(body.faq),
      readingMinutes: Number.isNaN(readingMinutes) ? 5 : readingMinutes,
      isActive: body.isActive !== false,
      publishedAt,
    },
  };
}
