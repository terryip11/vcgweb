import { readFileSync } from "fs";
import {
  HeadBucketCommand,
  ListBucketsCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

function loadEnv() {
  const env = {};
  const content = readFileSync(".env.local", "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

const env = loadEnv();
const required = [
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
];

console.log("--- Env check (values hidden) ---");
for (const k of required) {
  const v = env[k]?.trim() ?? "";
  console.log(`${k}: ${v ? `set (${v.length} chars)` : "MISSING"}`);
}
const publicUrl = env.R2_PUBLIC_URL?.trim();
console.log(`R2_PUBLIC_URL: ${publicUrl ? `set (${publicUrl.length} chars)` : "empty"}`);

const missing = required.filter((k) => !env[k]?.trim());
if (missing.length) {
  console.error("\nMISSING:", missing.join(", "));
  process.exit(1);
}

const client = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

const bucket = env.R2_BUCKET_NAME;
const testKey = `private/_connection-test/${Date.now()}.txt`;

try {
  console.log("\n--- ListBuckets ---");
  const list = await client.send(new ListBucketsCommand({}));
  const names = (list.Buckets ?? []).map((b) => b.Name);
  console.log("Buckets:", names.join(", ") || "(none)");
  if (!names.includes(bucket)) {
    console.error(`\nWARN: R2_BUCKET_NAME "${bucket}" not in account buckets`);
    console.error("Available:", names.join(", "));
  }

  console.log("\n--- HeadBucket ---");
  await client.send(new HeadBucketCommand({ Bucket: bucket }));
  console.log("OK:", bucket);

  console.log("\n--- PutObject test ---");
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: testKey,
      Body: "vcg-r2-connection-test",
      ContentType: "text/plain",
    }),
  );
  console.log("OK: uploaded", testKey);

  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: testKey }));
  console.log("OK: deleted test file");

  console.log("\nSUCCESS: R2 fully verified");
} catch (err) {
  console.error("\nFAIL:");
  console.error("  name:", err.name);
  console.error("  message:", err.message);
  console.error("  code:", err.Code ?? err.code ?? err.$metadata?.httpStatusCode);
  if (err.$metadata) {
    console.error("  httpStatus:", err.$metadata.httpStatusCode);
    console.error("  requestId:", err.$metadata.requestId);
  }
  process.exit(1);
}
