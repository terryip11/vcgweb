import { readFileSync } from "fs";
import { PutBucketCorsCommand, S3Client } from "@aws-sdk/client-s3";

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
const siteUrlRaw = env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "";
let siteOrigin = "";
if (siteUrlRaw) {
  try {
    siteOrigin = new URL(siteUrlRaw).origin;
  } catch {
    siteOrigin = siteUrlRaw;
  }
}

const origins = new Set([
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "http://127.0.0.1:3002",
]);

for (let port = 3000; port <= 3010; port++) {
  origins.add(`http://localhost:${port}`);
  origins.add(`http://127.0.0.1:${port}`);
}

if (siteOrigin) {
  origins.add(siteOrigin);
}

const allowedOrigins = [...origins];

const client = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

await client.send(
  new PutBucketCorsCommand({
    Bucket: env.R2_BUCKET_NAME,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedOrigins: allowedOrigins,
          AllowedMethods: ["GET", "PUT", "HEAD"],
          AllowedHeaders: ["*"],
          ExposeHeaders: ["ETag"],
          MaxAgeSeconds: 3600,
        },
      ],
    },
  }),
);

console.log("CORS configured for origins:");
for (const o of allowedOrigins) console.log("  -", o);
