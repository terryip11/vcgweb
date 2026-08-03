import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import LeadStatusBadge from "@/components/admin/LeadStatusBadge";
import MemberAffiliateApprovedBanner from "@/components/member/MemberAffiliateApprovedBanner";
import MemberLeadSummary from "@/components/member/MemberLeadSummary";
import MemberProfileForm from "@/components/member/MemberProfileForm";
import MemberQuickLinks from "@/components/member/MemberQuickLinks";
import MemberSignOutButton from "@/components/member/MemberSignOutButton";
import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import { isAdminUser } from "@/lib/admin/auth";
import {
  LOAN_CATEGORY_LABELS,
  USER_ROLE_LABELS,
} from "@/lib/admin/constants";
import {
  getMemberLeadStats,
  getMemberLeads,
  getMemberProfile,
} from "@/lib/supabase/member";
import { isValidHKPhone } from "@/lib/phone/hk-phone";
import {
  getAffiliatePartnerForUser,
  linkAffiliatePartnerToUser,
} from "@/lib/supabase/affiliate";
import { createClient } from "@/lib/supabase/server";
import type { LoanCategory } from "@/types";

export const metadata: Metadata = {
  title: "會員中心 | 創健佳商業事務所 | VCG",
  description: "VCG 會員中心 — 管理個人資料及查看貸款查詢記錄。",
};

const QUICK_LINKS = [
  {
    href: "/compare",
    title: "私人貸款比較",
    desc: "查看最新 APR 及優惠",
  },
  {
    href: "/sme",
    title: "中小企融資",
    desc: "八成信貸擔保資格評估",
  },
  {
    href: "/funds",
    title: "基金申請",
    desc: "ESS、BUD、EMF 等政府資助",
  },
  {
    href: "/calculator",
    title: "貸款計算機",
    desc: "估算每月還款及總利息",
  },
] as const;

export default async function MemberPage() {
  const supabase = await createClient();
  if (!supabase) redirect("/login?next=/member");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/member");

  await linkAffiliatePartnerToUser(user);
  const affiliatePartner = await getAffiliatePartnerForUser(supabase, user);
  const isApprovedAffiliate =
    affiliatePartner?.status === "approved" && Boolean(affiliatePartner.referralCode);
  const showAffiliateApprovedNotice =
    affiliatePartner?.status === "approved" &&
    Boolean(affiliatePartner.referralCode);

  const profile = await getMemberProfile(supabase, user.id);
  const leads = await getMemberLeads(supabase, user.id);
  const stats = getMemberLeadStats(leads);
  const isAdmin = await isAdminUser(supabase, user);

  const displayName =
    profile?.fullName ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    user.phone?.replace("+852", "") ||
    "會員";

  const memberPhone =
    profile?.phone ?? user.phone?.replace(/^\+852/, "") ?? "";
  const hasValidPhone = isValidHKPhone(memberPhone);

  const avatarUrl =
    profile?.avatarUrl || (user.user_metadata?.avatar_url as string | undefined);

  return (
    <PageShell>
      <PageHero
        badge="會員專區"
        title={`你好，${displayName}`}
        subtitle="管理您的個人資料及查看貸款查詢記錄。"
      />

      <section className="py-12">
        <div className="mx-auto max-w-6xl space-y-6 px-4">
          {showAffiliateApprovedNotice && affiliatePartner?.referralCode && (
            <MemberAffiliateApprovedBanner
              partnerId={affiliatePartner.id}
              referralCode={affiliatePartner.referralCode}
              approvedAt={affiliatePartner.approvedAt}
            />
          )}

          {isApprovedAffiliate && (
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 to-emerald-50 p-5 shadow-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">
                  推廣夥伴
                </p>
                <p className="mt-1 font-bold text-slate-900">
                  您的推廣代碼：{affiliatePartner!.referralCode}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  查看點擊、查詢及佣金，管理專屬推廣連結。
                </p>
              </div>
              <Link
                href="/affiliate"
                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-teal-700"
              >
                進入推廣後台
                <span aria-hidden>→</span>
              </Link>
            </div>
          )}

          {isAdmin && (
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50 p-5 shadow-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                  管理員
                </p>
                <p className="mt-1 font-bold text-slate-900">
                  您已登入管理員帳戶
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  可進入後台管理 Leads、產品、活動及數據分析。
                </p>
              </div>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
              >
                進入管理後台
                <span aria-hidden>→</span>
              </Link>
            </div>
          )}

          {leads.length > 0 && <MemberLeadSummary stats={stats} />}

          <div className="grid gap-8 lg:grid-cols-3">
            {/* 個人資料 */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-4">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarUrl}
                      alt=""
                      className="h-16 w-16 rounded-full object-cover ring-2 ring-blue-100"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-bold text-slate-900">{displayName}</h2>
                      {isAdmin && (
                        <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                          {USER_ROLE_LABELS.admin}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500">
                      {user.email || user.phone}
                    </p>
                    <p className="mt-1 text-xs text-emerald-600">
                      {user.app_metadata?.provider === "google"
                        ? "Google 帳戶已連結"
                        : user.phone
                          ? "電話帳戶"
                          : "電郵帳戶"}
                    </p>
                    {profile?.createdAt && (
                      <p className="mt-1 text-xs text-slate-400">
                        會員自{" "}
                        {new Date(profile.createdAt).toLocaleDateString("zh-HK", {
                          year: "numeric",
                          month: "long",
                        })}
                      </p>
                    )}
                  </div>
                </div>

                <MemberProfileForm
                  initialPhone={profile?.phone ?? ""}
                  initialAvatarUrl={profile?.avatarUrl ?? avatarUrl}
                  userId={user.id}
                />

                <div className="mt-6 border-t border-slate-100 pt-4">
                  <MemberSignOutButton />
                </div>
              </div>
            </div>

            {/* 查詢記錄 */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h2 className="mb-1 text-lg font-bold text-slate-900">
                  我的查詢記錄
                </h2>
                <p className="mb-6 text-sm text-slate-500">
                  點擊查詢可查看進度及上傳補充文件
                </p>

                {leads.length === 0 ? (
                  <div className="rounded-xl bg-slate-50 py-12 text-center">
                    <p className="text-sm text-slate-500">暫無查詢記錄</p>
                    <p className="mt-1 text-xs text-slate-400">
                      提交查詢後，記錄會自動顯示在此
                    </p>
                    <Link
                      href="/compare"
                      className="mt-4 inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
                    >
                      立即比較貸款
                    </Link>
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {leads.map((lead) => (
                      <li key={lead.id}>
                        <Link
                          href={`/member/leads/${lead.id}`}
                          className="block py-4 transition hover:bg-slate-50/80 -mx-2 px-2 rounded-xl"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold text-slate-900">
                                {lead.loanCategory
                                  ? LOAN_CATEGORY_LABELS[
                                      lead.loanCategory as LoanCategory
                                    ] ?? lead.loanCategory
                                  : "貸款查詢"}
                              </p>
                              <p className="text-sm text-slate-500">
                                #{lead.id.slice(0, 8).toUpperCase()}
                                {lead.loanAmount &&
                                  ` · HK$${lead.loanAmount.toLocaleString()}`}
                              </p>
                            </div>
                            <LeadStatusBadge status={lead.status} />
                          </div>
                          <p className="mt-1 text-xs text-slate-400">
                            {new Date(lead.createdAt).toLocaleDateString("zh-HK", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                            <span className="ml-2 text-blue-600">查看詳情 →</span>
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <MemberQuickLinks links={QUICK_LINKS} hasValidPhone={hasValidPhone} />
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
