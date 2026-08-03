import { getAdminEmails } from "@/lib/admin/auth";
import { getSiteUrl } from "@/lib/site";

interface LeadEmailData {
  name: string;
  phone: string;
  email?: string;
  loanAmount?: number;
  loanCategory?: string;
  productId?: string;
  source?: string;
  notes?: string;
}

interface AffiliateEmailData {
  name: string;
  phone: string;
  email: string;
  channel?: string;
  website?: string;
}

function getNotifyEmail(): string | null {
  return (
    process.env.ADMIN_NOTIFY_EMAIL?.trim() ||
    getAdminEmails()[0] ||
    null
  );
}

async function sendEmail(
  to: string | string[],
  subject: string,
  text: string,
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from =
    process.env.NOTIFY_FROM_EMAIL?.trim() || "VCG 通知 <onboarding@resend.dev>";

  if (!apiKey || !to || (Array.isArray(to) && to.length === 0)) {
    console.info("[Email notification skipped]", { to: !!to, apiKey: !!apiKey });
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(to) ? to : [to],
        subject,
        text,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Email send failed:", err);
    return false;
  }
}

async function sendAdminEmail(subject: string, text: string): Promise<void> {
  const to = getNotifyEmail();
  if (!to) return;
  await sendEmail(to, subject, text);
}

export async function notifyAdminNewLead(lead: LeadEmailData): Promise<void> {
  const lines = [
    `姓名：${lead.name}`,
    `電話：${lead.phone}`,
    lead.email ? `電郵：${lead.email}` : null,
    lead.loanCategory ? `類別：${lead.loanCategory}` : null,
    lead.loanAmount ? `金額：HK$${lead.loanAmount.toLocaleString()}` : null,
    lead.productId ? `產品：${lead.productId}` : null,
    lead.source ? `來源：${lead.source}` : null,
    lead.notes ? `\n備註：\n${lead.notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  await sendAdminEmail(
    `[VCG 新查詢] ${lead.name} · ${lead.source ?? "website"}`,
    `收到新的查詢：\n\n${lines}\n\n請登入管理後台跟進：${getSiteUrl()}/admin/leads`,
  );
}

export async function notifyAdminNewAffiliate(
  partner: AffiliateEmailData,
): Promise<void> {
  const lines = [
    `姓名：${partner.name}`,
    `電話：${partner.phone}`,
    `電郵：${partner.email}`,
    partner.channel ? `渠道：${partner.channel}` : null,
    partner.website ? `網站：${partner.website}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  await sendAdminEmail(
    `[VCG 新推廣夥伴申請] ${partner.name}`,
    `收到新的推廣夥伴申請：\n\n${lines}\n\n請登入審核：${getSiteUrl()}/admin/affiliates?status=pending`,
  );
}

interface AffiliateStatusEmailData {
  name: string;
  email: string;
  referralCode?: string;
}

export async function notifyAffiliateApproved(
  partner: AffiliateStatusEmailData,
): Promise<void> {
  const siteUrl = getSiteUrl();
  const code = partner.referralCode?.trim().toUpperCase();
  const refLine = code
    ? `\n推廣代碼：${code}\n專屬連結：${siteUrl}/compare?ref=${code}`
    : "";

  await sendEmail(
    partner.email,
    `[VCG] 推廣夥伴申請已獲批准`,
    `${partner.name} 您好，

恭喜！您的 VCG 推廣夥伴申請已獲批准。${refLine}

夥伴後台：${siteUrl}/affiliate
會員中心：${siteUrl}/member

請使用申請時的電郵登入會員帳戶，即可進入推廣後台查看數據、推廣連結及素材。

如有疑問，歡迎 WhatsApp 聯絡我們：85264754756

VCG 創健佳商業事務所
${siteUrl}`,
  );
}

export async function notifyAffiliateRejected(
  partner: AffiliateStatusEmailData,
): Promise<void> {
  const siteUrl = getSiteUrl();

  await sendEmail(
    partner.email,
    `[VCG] 推廣夥伴申請結果`,
    `${partner.name} 您好，

感謝您申請 VCG 推廣夥伴計劃。很抱歉，此次申請未能通過審核。

如您認為資料有誤或希望了解詳情，歡迎 WhatsApp 聯絡：85264754756

VCG 創健佳商業事務所
${siteUrl}`,
  );
}
