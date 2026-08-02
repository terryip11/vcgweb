export const REFERRAL_STORAGE_KEY = "vcg_referral_code";
export const REFERRAL_COOKIE = "vcg_ref";
export const REFERRAL_PARAM = "ref";
const REFERRAL_MAX_AGE_SEC = 60 * 60 * 24 * 30;

export function normalizeReferralCode(code: string): string {
  return code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 32);
}

export function captureReferralFromSearch(search: string): string | null {
  const params = new URLSearchParams(search);
  const ref = params.get(REFERRAL_PARAM);
  if (!ref) return null;
  const normalized = normalizeReferralCode(ref);
  return normalized || null;
}

export function storeReferralCode(code: string): void {
  if (typeof window === "undefined") return;
  const normalized = normalizeReferralCode(code);
  if (!normalized) return;

  localStorage.setItem(REFERRAL_STORAGE_KEY, normalized);
  document.cookie = `${REFERRAL_COOKIE}=${encodeURIComponent(normalized)}; path=/; max-age=${REFERRAL_MAX_AGE_SEC}; SameSite=Lax`;
}

export function getStoredReferralCode(): string | null {
  if (typeof window === "undefined") return null;

  const fromStorage = localStorage.getItem(REFERRAL_STORAGE_KEY);
  if (fromStorage) {
    const normalized = normalizeReferralCode(fromStorage);
    return normalized || null;
  }

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${REFERRAL_COOKIE}=([^;]*)`),
  );
  if (match?.[1]) {
    const normalized = normalizeReferralCode(decodeURIComponent(match[1]));
    return normalized || null;
  }

  return null;
}

import { getSiteUrl } from "@/lib/site";

export function buildReferralLink(path: string, code: string, origin?: string): string {
  const base =
    origin ??
    (typeof window !== "undefined" ? window.location.origin : getSiteUrl());
  const url = new URL(path, base);
  url.searchParams.set(REFERRAL_PARAM, normalizeReferralCode(code));
  return url.toString();
}
