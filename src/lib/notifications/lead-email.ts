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

async function sendAdminEmail(subject: string, text: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = getNotifyEmail();
  const from =
    process.env.NOTIFY_FROM_EMAIL?.trim() || "VCG 通知 <onboarding@resend.dev>";

  if (!apiKey || !to) {
    console.info("[Email notification skipped]", { to: !!to, apiKey: !!apiKey });
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], subject, text }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
    }
  } catch (err) {
    console.error("Email send failed:", err);
  }
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
    `收到新的推廣夥伴申請：\n\n${lines}\n\n請登入審核：${getSiteUrl()}/admin/affiliates`,
  );
}
