import { getSupabaseAnonKey, getSupabaseUrl } from "./env";

export interface AuthProviderStatus {
  google: boolean;
  email: boolean;
}

export async function getAuthProviderStatus(): Promise<AuthProviderStatus | null> {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) return null;

  try {
    const res = await fetch(`${url}/auth/v1/settings`, {
      headers: { apikey: key },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      google: Boolean(data.external?.google),
      email: Boolean(data.external?.email),
    };
  } catch {
    return null;
  }
}
