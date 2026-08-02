import type { SupabaseClient, User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { DEFAULT_ADMIN_EMAIL } from "@/lib/admin/constants";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types";

export function getAdminEmails(): string[] {
  const fromEnv = process.env.ADMIN_EMAILS;
  if (fromEnv?.trim()) {
    return fromEnv
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);
  }
  return [DEFAULT_ADMIN_EMAIL.toLowerCase()];
}

function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}

export async function getUserRole(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserRole | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (error || !data?.role) return null;
  return data.role as UserRole;
}

export async function isAdminUser(
  supabase: SupabaseClient,
  user: User,
): Promise<boolean> {
  const role = await getUserRole(supabase, user.id);
  if (role === "admin") return true;
  return isAdminEmail(user.email);
}

export async function requireAdmin() {
  const supabase = await createClient();
  if (!supabase) redirect("/login?error=config&next=/admin");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/admin");

  const admin = await isAdminUser(supabase, user);
  if (!admin) redirect("/admin/unauthorized");

  return { supabase, user };
}

export async function requireAdminApi() {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const admin = await isAdminUser(supabase, user);
  if (!admin) return null;

  return { supabase, user };
}
