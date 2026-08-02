import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getR2Client } from "./client";
import { getR2Bucket, getR2PublicUrl } from "./config";

export function getPublicMediaUrl(objectKey: string): string {
  const base = getR2PublicUrl();
  if (base) return `${base}/${objectKey}`;
  return `/api/media/view?key=${encodeURIComponent(objectKey)}`;
}

export async function getPrivateMediaUrl(
  objectKey: string,
  expiresIn = 900,
): Promise<string | null> {
  const client = getR2Client();
  if (!client) return null;

  const command = new GetObjectCommand({
    Bucket: getR2Bucket(),
    Key: objectKey,
  });

  return getSignedUrl(client, command, { expiresIn });
}

export function resolveMediaUrl(
  objectKey: string,
  isPublic: boolean,
): Promise<string | null> | string {
  if (isPublic) return getPublicMediaUrl(objectKey);
  return getPrivateMediaUrl(objectKey);
}
