interface Bucket {
  count: number;
  resetAt: number;
}

const store = new Map<string, Bucket>();

/** Simple in-memory rate limiter (per server instance). */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const bucket = store.get(key);

  if (!bucket || now >= bucket.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return { allowed: true };
}

export function getClientIp(request: Request): string {
  const cf = request.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function enforceRateLimit(
  request: Request,
  namespace: string,
  limit = 10,
  windowMs = 60_000,
): Response | null {
  const ip = getClientIp(request);
  const result = checkRateLimit(`${namespace}:${ip}`, limit, windowMs);
  if (result.allowed) return null;

  return new Response(
    JSON.stringify({ error: "請求過於頻繁，請稍後再試" }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(result.retryAfterSec ?? 60),
      },
    },
  );
}
