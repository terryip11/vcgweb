import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getAffiliatePartnerForUser,
  linkAffiliatePartnerToUser,
} from "@/lib/supabase/affiliate";
import type { AffiliatePartner } from "@/types";

export async function requireAffiliatePartner(): Promise<{
  supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>;
  user: User;
  partner: AffiliatePartner;
}> {
  const supabase = await createClient();
  if (!supabase) redirect("/login?error=config&next=/affiliate");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/affiliate");

  await linkAffiliatePartnerToUser(user);

  const partner = await getAffiliatePartnerForUser(supabase, user);
  if (!partner) redirect("/partner?apply=1");
  if (partner.status === "pending") redirect("/affiliate/pending");
  if (partner.status === "rejected" || partner.status === "suspended") {
    redirect("/affiliate/unavailable");
  }
  if (!partner.referralCode) redirect("/affiliate/pending");

  return { supabase, user, partner };
}

export async function requireAffiliateApi() {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  await linkAffiliatePartnerToUser(user);

  const partner = await getAffiliatePartnerForUser(supabase, user);
  if (!partner || partner.status !== "approved" || !partner.referralCode) {
    return null;
  }

  return { supabase, user, partner };
}
