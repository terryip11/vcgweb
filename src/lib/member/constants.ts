import type { LeadStatus } from "@/types";

export const MEMBER_PROGRESS_STEPS = [
  { label: "已提交", description: "查詢已成功提交" },
  { label: "已聯絡", description: "VCG 顧問已與您聯絡" },
  { label: "處理中", description: "正在配對及跟進方案" },
  { label: "已完成", description: "查詢流程已完結" },
] as const;

export const MEMBER_STATUS_MESSAGES: Partial<Record<LeadStatus, string>> = {
  new: "您的查詢已收到，VCG 顧問將在 1 個工作天內與您聯絡。",
  contacted: "VCG 顧問已嘗試與您聯絡，如有遺漏請透過 WhatsApp 與我們聯絡。",
  qualified: "您的申請符合初步條件，顧問正在為您配對最合適的方案。",
  referred: "您的申請已轉介至相關機構，顧問會持續跟進進度。",
  closed_won: "恭喜！您的貸款查詢已成功完成。如有其他需要，歡迎再次查詢。",
  closed_lost: "此查詢已結束。如有其他貸款需要，歡迎提交新查詢。",
  no_response: "我們尚未收到您的回覆，請透過 WhatsApp 與 VCG 聯絡以便繼續跟進。",
};

const PENDING_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "referred",
  "no_response",
];

export function isPendingLeadStatus(status: string): boolean {
  return PENDING_STATUSES.includes(status as LeadStatus);
}

export function getMemberProgressIndex(status: LeadStatus): number {
  switch (status) {
    case "new":
      return 0;
    case "contacted":
    case "no_response":
      return 1;
    case "qualified":
    case "referred":
      return 2;
    case "closed_won":
    case "closed_lost":
      return 3;
    default:
      return 0;
  }
}

export function getMemberProgressVariant(
  status: LeadStatus,
): "default" | "success" | "muted" {
  if (status === "closed_won") return "success";
  if (status === "closed_lost") return "muted";
  return "default";
}

export const VCG_WHATSAPP = "85264754756";

export function memberLeadWhatsAppMessage(options: {
  leadId: string;
  name: string;
  categoryLabel?: string;
}): string {
  const ref = options.leadId.slice(0, 8).toUpperCase();
  const category = options.categoryLabel ? `（${options.categoryLabel}）` : "";
  return `你好，我是 ${options.name}，想查詢我的貸款申請進度${category}，查詢編號：${ref}`;
}
