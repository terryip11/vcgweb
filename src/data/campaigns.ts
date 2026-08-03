import type { Campaign } from "@/types";

export const campaigns: Campaign[] = [
  {
    id: "tax-season-2026",
    title: "稅季貸款限時優惠",
    subtitle:
      "WeLend 稅季專享 APR 低至 2.78%，VCG 客戶經本網申請享免手續費諮詢及專人跟進",
    ctaText: "立即比較稅季貸款",
    ctaHref: "/compare",
    badge: "限時",
    expiresAt: "2026-04-30",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "sme-guarantee-2026",
    title: "政府中小企融資 · 八成信貸擔保計劃",
    subtitle:
      "八成信貸擔保計劃，最高貸款額 HK$1,800 萬，年利率 3-5%，VCG 協助配對及文件準備",
    ctaText: "查看政府融資方案",
    ctaHref: "/sme",
    badge: "政府擔保",
    expiresAt: "2028-03-31",
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "owner-enterprise",
    title: "獨家「業主 + 企業」聯動方案",
    subtitle:
      "免抵押業主貸款最高達物業估值 80%，業主與企業貸款靈活配對，優化現金流",
    ctaText: "了解業主貸款",
    ctaHref: "/compare?category=owner",
    badge: "VCG 獨家",
    isActive: true,
    sortOrder: 3,
  },
];
