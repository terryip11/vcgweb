import type { SupabaseClient } from "@supabase/supabase-js";
import { getPrivateMediaUrl, getPublicMediaUrl } from "@/lib/r2/urls";
import type { MediaAsset, MediaEntityType } from "@/types";

function mapAsset(row: Record<string, unknown>): MediaAsset {
  return {
    id: row.id as string,
    objectKey: row.object_key as string,
    entityType: row.entity_type as MediaEntityType,
    entityId: (row.entity_id as string | null) ?? undefined,
    category: row.category as string,
    originalName: (row.original_name as string | null) ?? undefined,
    mimeType: row.mime_type as string,
    sizeBytes: row.size_bytes as number,
    isPublic: row.is_public as boolean,
    uploadedBy: (row.uploaded_by as string | null) ?? undefined,
    createdAt: row.created_at as string,
  };
}

async function listMediaByEntity(
  supabase: SupabaseClient,
  entityType: MediaEntityType,
  entityId: string,
): Promise<MediaAsset[]> {
  const { data, error } = await supabase
    .from("media_assets")
    .select("*")
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(mapAsset);
}

export async function attachMediaUrls(
  assets: MediaAsset[],
): Promise<MediaAsset[]> {
  return Promise.all(
    assets.map(async (asset) => ({
      ...asset,
      url: asset.isPublic
        ? getPublicMediaUrl(asset.objectKey)
        : (await getPrivateMediaUrl(asset.objectKey)) ?? undefined,
    })),
  );
}

export async function getMediaByEntity(
  supabase: SupabaseClient,
  entityType: MediaEntityType,
  entityId: string,
): Promise<MediaAsset[]> {
  const assets = await listMediaByEntity(supabase, entityType, entityId);
  return attachMediaUrls(assets);
}

export async function getMediaById(
  supabase: SupabaseClient,
  id: string,
): Promise<MediaAsset | null> {
  const { data, error } = await supabase
    .from("media_assets")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  const [withUrl] = await attachMediaUrls([mapAsset(data)]);
  return withUrl ?? null;
}

export async function countLeadMedia(
  supabase: SupabaseClient,
  leadId: string,
): Promise<number> {
  const { count, error } = await supabase
    .from("media_assets")
    .select("*", { count: "exact", head: true })
    .eq("entity_type", "lead")
    .eq("entity_id", leadId);

  if (error) return 0;
  return count ?? 0;
}

export async function insertMediaAsset(
  supabase: SupabaseClient,
  row: {
    id: string;
    objectKey: string;
    entityType: MediaEntityType;
    entityId: string;
    category: string;
    originalName?: string;
    mimeType: string;
    sizeBytes: number;
    isPublic: boolean;
    uploadedBy?: string | null;
  },
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.from("media_assets").insert({
    id: row.id,
    object_key: row.objectKey,
    entity_type: row.entityType,
    entity_id: row.entityId,
    category: row.category,
    original_name: row.originalName ?? null,
    mime_type: row.mimeType,
    size_bytes: row.sizeBytes,
    is_public: row.isPublic,
    uploaded_by: row.uploadedBy ?? null,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function deleteMediaAsset(
  supabase: SupabaseClient,
  id: string,
): Promise<MediaAsset | null> {
  const asset = await getMediaById(supabase, id);
  if (!asset) return null;

  const { error } = await supabase.from("media_assets").delete().eq("id", id);
  if (error) return null;
  return asset;
}

/** 刪除某實體的全部 media_assets 記錄，回傳已刪除的 object keys 供清理 R2 */
export async function deleteMediaByEntity(
  supabase: SupabaseClient,
  entityType: MediaEntityType,
  entityId: string,
): Promise<{ assets: MediaAsset[]; error?: string }> {
  const assets = await listMediaByEntity(supabase, entityType, entityId);
  if (assets.length === 0) return { assets: [] };

  const { error } = await supabase
    .from("media_assets")
    .delete()
    .eq("entity_type", entityType)
    .eq("entity_id", entityId);

  if (error) return { assets: [], error: error.message };
  return { assets };
}
