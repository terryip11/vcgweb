import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_BYTES,
  type AllowedMimeType,
} from "@/lib/r2/config";
import type { MediaEntityType } from "@/types";

const ENTITY_CATEGORIES: Record<MediaEntityType, string[]> = {
  lead: ["lead_br", "lead_bank_statement", "lead_id", "lead_financial", "lead_other"],
  product: ["product_image"],
  campaign: ["campaign_banner"],
  profile: ["avatar"],
  site: ["site"],
};

export function validateMediaUpload(input: {
  entityType: MediaEntityType;
  category: string;
  mimeType: string;
  sizeBytes: number;
}): { ok: true } | { ok: false; error: string } {
  if (!ALLOWED_MIME_TYPES.includes(input.mimeType as AllowedMimeType)) {
    return { ok: false, error: "不支援的檔案格式（僅 JPG/PNG/WebP/GIF/PDF）" };
  }

  if (input.sizeBytes <= 0 || input.sizeBytes > MAX_FILE_BYTES) {
    return { ok: false, error: "檔案大小須在 5MB 以內" };
  }

  const allowed = ENTITY_CATEGORIES[input.entityType];
  if (!allowed?.includes(input.category)) {
    return { ok: false, error: "無效的檔案類別" };
  }

  return { ok: true };
}
