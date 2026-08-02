import { PUBLIC_CATEGORIES } from "./config";

const EXT_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "application/pdf": "pdf",
};

export function mimeToExt(mimeType: string): string {
  return EXT_MAP[mimeType] ?? "bin";
}

export function buildObjectKey(options: {
  entityType: string;
  entityId: string;
  category: string;
  mimeType: string;
  assetId: string;
}): { objectKey: string; isPublic: boolean } {
  const ext = mimeToExt(options.mimeType);
  const isPublic = PUBLIC_CATEGORIES.has(options.category);
  const prefix = isPublic ? "public" : "private";
  const folder = `${options.entityType}/${options.entityId}/${options.category}`;

  return {
    objectKey: `${prefix}/${folder}/${options.assetId}.${ext}`,
    isPublic,
  };
}
