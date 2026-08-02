import type { LeadStatus, LoanCategory, UserRole } from "@/types";

export const DEFAULT_ADMIN_EMAIL = "vcgrouphk@gmail.com";

export const LEAD_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "referred",
  "closed_won",
  "closed_lost",
  "no_response",
];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "新查詢",
  contacted: "已聯絡",
  qualified: "有意向",
  referred: "已轉介",
  closed_won: "已成交",
  closed_lost: "已流失",
  no_response: "無回應",
};

export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  new: "bg-blue-50 text-blue-700",
  contacted: "bg-amber-50 text-amber-700",
  qualified: "bg-purple-50 text-purple-700",
  referred: "bg-indigo-50 text-indigo-700",
  closed_won: "bg-emerald-50 text-emerald-700",
  closed_lost: "bg-slate-100 text-slate-600",
  no_response: "bg-red-50 text-red-600",
};

export const LOAN_CATEGORIES: LoanCategory[] = [
  "personal",
  "sme",
  "owner",
  "tax",
  "business",
];

export const LOAN_CATEGORY_LABELS: Record<LoanCategory, string> = {
  personal: "私人貸款",
  sme: "中小企",
  owner: "業主貸款",
  tax: "稅季貸款",
  business: "小商務",
};

export const LEAD_SOURCE_LABELS: Record<string, string> = {
  website: "網站",
  comparison_table: "比較表",
  comparison_apply: "比較表申請",
  comparison_whatsapp: "比較表 WhatsApp",
  fund_application: "基金申請",
  sme_quiz: "SME 問卷",
  campaign_banner: "活動橫幅",
};

export function getLeadSourceLabel(source: string): string {
  return LEAD_SOURCE_LABELS[source] ?? source;
}

export function getLeadCategoryLabel(lead: {
  loanCategory?: LoanCategory | null;
  source?: string | null;
}): string {
  if (lead.source === "fund_application") return "基金申請";
  if (lead.source === "sme_quiz") return "SME 融資";
  if (lead.loanCategory) return LOAN_CATEGORY_LABELS[lead.loanCategory];
  return "—";
}

export const LEAD_SOURCE_FILTER_OPTIONS = [
  { value: "all", label: "全部來源" },
  { value: "fund_application", label: "基金申請" },
  { value: "sme_quiz", label: "SME 問卷" },
  { value: "comparison_table", label: "比較表" },
  { value: "website", label: "網站" },
] as const;

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  member: "會員",
  admin: "管理員",
};

export function formatHKD(amount?: number | null): string {
  if (amount == null) return "—";
  return `HK$${amount.toLocaleString("zh-HK")}`;
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("zh-HK", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function whatsappUrl(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  const hk = digits.startsWith("852") ? digits : `852${digits}`;
  return `https://wa.me/${hk}?text=${encodeURIComponent(message)}`;
}

export function linesToArray(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function arrayToLines(items: string[]): string {
  return items.join("\n");
}
