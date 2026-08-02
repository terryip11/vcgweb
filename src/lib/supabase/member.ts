import type { SupabaseClient } from "@supabase/supabase-js";
import type { MemberLead, MemberLeadStats, MemberProfile } from "@/types";

export async function getMemberProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<MemberProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, avatar_url, phone, created_at")
    .eq("id", userId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    email: data.email ?? undefined,
    fullName: data.full_name ?? undefined,
    avatarUrl: data.avatar_url ?? undefined,
    phone: data.phone ?? undefined,
    createdAt: data.created_at,
  };
}

export async function getMemberLeads(
  supabase: SupabaseClient,
  userId: string,
): Promise<MemberLead[]> {
  const { data, error } = await supabase
    .from("leads")
    .select(
      "id, name, phone, email, loan_amount, loan_category, status, source, product_id, created_at",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email ?? undefined,
    loanAmount: row.loan_amount ?? undefined,
    loanCategory: row.loan_category ?? undefined,
    status: row.status,
    source: row.source ?? undefined,
    productId: row.product_id ?? undefined,
    createdAt: row.created_at,
  }));
}

export async function getMemberLeadById(
  supabase: SupabaseClient,
  userId: string,
  leadId: string,
): Promise<MemberLead | null> {
  const { data, error } = await supabase
    .from("leads")
    .select(
      "id, name, phone, email, loan_amount, loan_category, status, source, product_id, created_at",
    )
    .eq("id", leadId)
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    name: data.name,
    phone: data.phone,
    email: data.email ?? undefined,
    loanAmount: data.loan_amount ?? undefined,
    loanCategory: data.loan_category ?? undefined,
    status: data.status,
    source: data.source ?? undefined,
    productId: data.product_id ?? undefined,
    createdAt: data.created_at,
  };
}

export function getMemberLeadStats(leads: MemberLead[]): MemberLeadStats {
  let pending = 0;
  let completed = 0;

  for (const lead of leads) {
    if (lead.status === "closed_won") {
      completed += 1;
    } else if (lead.status !== "closed_lost") {
      pending += 1;
    }
  }

  return { total: leads.length, pending, completed };
}
