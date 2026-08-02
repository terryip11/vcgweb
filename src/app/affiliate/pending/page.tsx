import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import { createClient } from "@/lib/supabase/server";
import { getAffiliatePartnerForUser, linkAffiliatePartnerToUser } from "@/lib/supabase/affiliate";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "審核中 | VCG 推廣夥伴",
};

export default async function AffiliatePendingPage() {
  const supabase = await createClient();
  if (!supabase) redirect("/login?next=/affiliate");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/affiliate");

  await linkAffiliatePartnerToUser(user);

  const partner = await getAffiliatePartnerForUser(supabase, user);
  if (partner?.status === "approved" && partner.referralCode) {
    redirect("/affiliate");
  }

  return (
    <PageShell>
      <PageHero
        badge="推廣夥伴"
        title="申請審核中"
        subtitle="VCG 團隊正在處理您的推廣夥伴申請，批准後即可使用自助後台。"
      />
      <section className="py-12">
        <div className="mx-auto max-w-lg px-4 text-center">
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-8">
            <p className="text-sm text-slate-700">
              通常需 <strong>1–3 個工作天</strong>。批准後我們會以 WhatsApp
              或電郵通知，並發送您的專屬推廣代碼。
            </p>
            <p className="mt-4 text-sm text-slate-500">
              尚未申請？{" "}
              <Link href="/partner#apply" className="font-semibold text-teal-600 hover:underline">
                立即提交申請
              </Link>
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
