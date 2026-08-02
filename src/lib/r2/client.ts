import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getR2AccountId, getR2Bucket } from "./config";

export function getR2Client(): S3Client | null {
  const accountId = getR2AccountId();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) return null;

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export async function createPresignedUploadUrl(
  objectKey: string,
  mimeType: string,
  expiresIn = 600,
): Promise<string | null> {
  const client = getR2Client();
  if (!client) return null;

  const command = new PutObjectCommand({
    Bucket: getR2Bucket(),
    Key: objectKey,
    ContentType: mimeType,
  });

  return getSignedUrl(client, command, { expiresIn });
}

export async function deleteR2Object(objectKey: string): Promise<boolean> {
  const client = getR2Client();
  if (!client) return false;

  try {
    await client.send(
      new DeleteObjectCommand({
        Bucket: getR2Bucket(),
        Key: objectKey,
      }),
    );
    return true;
  } catch {
    return false;
  }
}
