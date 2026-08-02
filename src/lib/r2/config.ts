export function getR2AccountId(): string | undefined {
  return process.env.R2_ACCOUNT_ID;
}

export function getR2Bucket(): string {
  return process.env.R2_BUCKET_NAME || "vcg-media";
}

export function getR2PublicUrl(): string | undefined {
  return process.env.R2_PUBLIC_URL?.replace(/\/$/, "");
}

export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY,
  );
}

/** 允許的 MIME 類型 */
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
] as const;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

/** 單檔上限 5MB */
export const MAX_FILE_BYTES = 5 * 1024 * 1024;

/** 每個 lead 最多 10 個附件 */
export const MAX_LEAD_FILES = 10;

export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const MEDIA_CATEGORY_LABELS: Record<string, string> = {
  avatar: "頭像",
  product_image: "產品圖片",
  campaign_banner: "活動橫幅",
  lead_br: "商業登記證",
  lead_bank_statement: "銀行月結單",
  lead_id: "身份證明",
  lead_financial: "財務報表",
  lead_other: "其他文件",
  site: "網站素材",
};

/** 公開 CDN 可直連的 category */
export const PUBLIC_CATEGORIES = new Set([
  "avatar",
  "product_image",
  "campaign_banner",
  "site",
]);
