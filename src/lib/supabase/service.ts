import { createClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "./env";

export function createServiceClient() {
  const url = getSupabaseUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return null;

  return createClient(url, key);
}
