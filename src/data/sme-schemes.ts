import type { SmeScheme } from "@/types";

export const smeSchemes: SmeScheme[] = [
  {
    id: "80-guarantee",
    name: "八成信貸擔保產品",
    maxAmount: "HK$1,800 萬",
    maxTerm: "10 年",
    interestRate: "3-5%",
    deadline: "2028 年 3 月 31 日",
    status: "active",
    requirements: [
      "在香港註冊及已營運最少 12 個月",
      "個人擔保：須持有 50% 以上股權",
      "商業登記證及公司註冊證書",
      "最近六個月主要銀行月結單",
      "最近一年財務報表（如適用）",
    ],
    highlights: [
      "《2025 年施政報告》宣布申請期延長兩年至 2028 年 3 月 31 日",
      "計劃總信貸保證承擔額增加 200 億港元至合共 3,100 億港元",
      "「還息不還本」安排申請期延長至 2026 年 11 月 17 日",
    ],
  },
];

/** 已完結的政府擔保計劃（僅供參考） */
export const endedSmeSchemes: SmeScheme[] = [
  {
    id: "90-guarantee",
    name: "九成信貸擔保產品",
    maxAmount: "HK$800 萬",
    maxTerm: "8 年",
    interestRate: "3-5%",
    deadline: "2026 年 3 月 31 日",
    status: "ended",
    requirements: [
      "個人擔保：須持有 50% 以上股權",
      "商業登記證及公司註冊證書",
      "最近六個月主要銀行月結單",
    ],
  },
  {
    id: "100-guarantee",
    name: "百分百擔保特惠貸款",
    maxAmount: "HK$900 萬",
    maxTerm: "10 年",
    interestRate: "2.5%",
    status: "ended",
    requirements: [
      "在香港註冊及 2022 年 3 月 31 日前已營運最少 3 個月",
      "強積金及出糧記錄",
      "營業額下跌證明",
    ],
  },
];
