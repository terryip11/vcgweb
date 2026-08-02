export interface FundingScheme {
  id: string;
  name: string;
  shortName: string;
  provider: string;
  maxFunding: string;
  fundingRatio?: string;
  deadline?: string;
  status: "active" | "ongoing" | "ended";
  summary: string;
  highlights: string[];
  requirements: string[];
  applyUrl?: string;
  contactEmail?: string;
}

export const fundingSchemes: FundingScheme[] = [
  {
    id: "ess",
    name: "企業支援計劃（ESS）",
    shortName: "ESS",
    provider: "創新科技署 ITC",
    maxFunding: "HK$1,000 萬",
    fundingRatio: "政府資助最多 50%",
    deadline: "全年接受申請",
    status: "ongoing",
    summary:
      "資助本地企業進行內部研發（R&D）項目，推動科技創新及產業化。企業須承擔不少於項目總成本 50%，項目期一般不超過 24 個月。",
    highlights: [
      "2026–27 年度資助上限提升至 HK$1,000 萬",
      "全年接受申請，無固定截止日",
      "首期撥款可達批准資助額 20%",
    ],
    requirements: [
      "在香港註冊並有實質業務運作",
      "非上市公司（不含上市公司附屬機構）",
      "項目以研發為主，具科技創新含量",
      "企業承擔不少於項目總成本 50%",
    ],
    applyUrl: "https://www.itf.gov.hk/tc/funding-programmes/supporting-research/ess/",
    contactEmail: "ess@itc.gov.hk",
  },
  {
    id: "tvp",
    name: "科技券（TVP）",
    shortName: "TVP",
    provider: "創新科技署 ITC",
    maxFunding: "HK$600,000",
    fundingRatio: "政府資助 75%",
    deadline: "全年接受申請",
    status: "ongoing",
    summary:
      "資助本地中小企使用科技服務及方案，提升生產力及業務效率，例如 ERP、CRM、網上商店及 cybersecurity 等。",
    highlights: [
      "每間企業累計資助上限 HK$60 萬",
      "資助比例 75%，企業自付 25%",
      "適用於已營運的本地中小企",
    ],
    requirements: [
      "在香港註冊並有實質業務運作",
      "非上市公司",
      "使用已登記的 TVP 服務供應商",
    ],
    applyUrl: "https://www.itf.gov.hk/tc/funding-programmes/supporting-research/tvp/",
  },
  {
    id: "bud",
    name: "BUD 專項基金",
    shortName: "BUD",
    provider: "貿易及物流局",
    maxFunding: "HK$700 萬",
    fundingRatio: "政府資助 50%",
    deadline: "全年接受申請",
    status: "ongoing",
    summary:
      "支援企業發展品牌、升級轉型及拓展內銷市場（包括東盟及其他經濟合作組織市場），涵蓋品牌設計、電商、展覽及宣傳等。",
    highlights: [
      "內銷市場（Mainland）累計上限 HK$700 萬",
      "東盟等市場另設專項上限",
      "適用於非上市本地企業",
    ],
    requirements: [
      "在香港註冊並有實質業務運作",
      "非上市公司",
      "有明確品牌／升級／市場拓展計劃",
    ],
    applyUrl: "https://www.bud.hkpc.org/",
  },
  {
    id: "emf",
    name: "中小企市場推廣基金（EMF）",
    shortName: "EMF",
    provider: "工業貿易署",
    maxFunding: "HK$800,000",
    fundingRatio: "資助 50%",
    deadline: "全年接受申請",
    status: "ongoing",
    summary:
      "資助本地中小企參與出口推廣活動，包括本地及海外展覽、網上推廣、產品目錄及宣傳等。",
    highlights: [
      "每間企業累計資助上限 HK$80 萬",
      "涵蓋本地及海外市場推廣活動",
      "適用於有出口業務的中小企",
    ],
    requirements: [
      "在香港註冊並有實質業務運作",
      "非上市公司",
      "從事出口或有意拓展出口市場",
    ],
    applyUrl: "https://www.tid.gov.hk/tc_chi/sme/emf/emf.html",
  },
];

export const FUND_APPLICATION_STEPS = [
  { step: 1, title: "構思與諮詢", desc: "了解計劃要求，初步評估項目方向" },
  { step: 2, title: "撰寫計劃書", desc: "準備技術、時間表、預算及文件" },
  { step: 3, title: "網上提交", desc: "透過政府平台提交正式申請" },
  { step: 4, title: "評審與答辯", desc: "約 3–4 個月評審，或需出席答辯" },
  { step: 5, title: "簽約與撥款", desc: "批核後簽署協議，按進度分期撥款" },
] as const;
