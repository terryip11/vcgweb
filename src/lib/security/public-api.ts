import { enforceRateLimit } from "@/lib/security/rate-limit";
import {
  isTurnstileEnabled,
  turnstileRequiredResponse,
  verifyTurnstileToken,
} from "@/lib/security/turnstile";
import { getClientIp } from "@/lib/security/rate-limit";

interface GuardOptions {
  namespace: string;
  limit?: number;
  windowMs?: number;
  turnstileToken?: string | null;
}

/** Rate limit + optional Turnstile for public POST endpoints. */
export async function guardPublicApi(
  request: Request,
  options: GuardOptions,
): Promise<Response | null> {
  const rateLimited = enforceRateLimit(
    request,
    options.namespace,
    options.limit,
    options.windowMs,
  );
  if (rateLimited) return rateLimited;

  if (isTurnstileEnabled()) {
    const ok = await verifyTurnstileToken(
      options.turnstileToken,
      getClientIp(request),
    );
    if (!ok) return turnstileRequiredResponse();
  }

  return null;
}
