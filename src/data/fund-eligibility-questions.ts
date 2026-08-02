import type {
  EligibilityAnswer,
  EligibilityQuestion,
  EligibilityResult,
} from "@/data/sme-eligibility-questions";

export type FundSchemeId = "ess" | "tvp" | "bud" | "emf";

export interface FundQuizConfig {
  id: FundSchemeId;
  shortName: string;
  schemeName: string;
  authority: string;
  questions: EligibilityQuestion[];
  documentChecklist: string[];
  notEligibleTitle: string;
  notEligibleSummary: string;
  partialTitle: string;
  partialSummary: string;
  eligibleTitle: string;
  eligibleSummary: string;
}

const COMMON_HK_REGISTERED: EligibilityQuestion = {
  id: "hk-registered",
  question: "您的企業是否在香港註冊，並有實質業務運作？",
  hint: "須持有有效商業登記證，並有本地營運證明。",
  required: true,
  failMessage: "須為在香港註冊並有實質業務運作的企業。",
};

const COMMON_NON_LISTED: EligibilityQuestion = {
  id: "non-listed",
  question: "企業是否為非上市公司（不含上市公司附屬機構）？",
  required: true,
  failMessage: "本計劃一般不適用於上市公司及其附屬機構。",
};

/** 參考創新科技署企業支援計劃（ESS）2026–27 年度要求 */
export const ESS_ELIGIBILITY_QUESTIONS: EligibilityQuestion[] = [
  COMMON_HK_REGISTERED,
  COMMON_NON_LISTED,
  {
    id: "rd-project",
    question: "項目是否以內部研發（R&D）為主，並具科技創新含量？",
    hint: "例如新產品、新技術或新工藝的研發。",
    required: true,
    failMessage: "ESS 主要資助研發項目，一般營運開支不在資助範圍。",
  },
  {
    id: "cost-sharing",
    question: "企業是否願意承擔不少於項目總成本 50%？",
    hint: "政府資助比例一般最多 50%，餘下由企業自付。",
    required: true,
    failMessage: "ESS 要求企業分擔不少於一半項目成本。",
  },
  {
    id: "project-duration",
    question: "項目是否預計在 24 個月或以內完成？",
    required: true,
    failMessage: "ESS 項目期一般不超過 24 個月。",
  },
  {
    id: "project-plan",
    question: "能否準備項目計劃書（技術、時間表、預算）？",
    required: true,
    failMessage: "詳細項目計劃書為 ESS 申請核心文件。",
  },
  {
    id: "financials",
    question: "能否提供最近年度財務報表？",
    required: false,
    failMessage: "建議預先整理財務報表以支持申請。",
  },
  {
    id: "operation-proof",
    question: "能否提供實質業務運作證明（如 MPF、合約、發票等）？",
    required: false,
    failMessage: "建議預先準備營運證明文件。",
  },
];

/** 參考創新科技署科技券（TVP）要求 */
export const TVP_ELIGIBILITY_QUESTIONS: EligibilityQuestion[] = [
  COMMON_HK_REGISTERED,
  COMMON_NON_LISTED,
  {
    id: "sme-operating",
    question: "企業是否為已營運的本地中小企（非新成立空殼公司）？",
    hint: "TVP 旨在協助已有業務的中小企採用科技方案。",
    required: true,
    failMessage: "TVP 適用於已營運的本地中小企。",
  },
  {
    id: "tech-adoption",
    question:
      "項目是否涉及採用科技服務或方案（如 ERP、CRM、網店、cybersecurity 等）？",
    hint: "須為提升生產力或業務效率的科技應用，而非一般營運開支。",
    required: true,
    failMessage: "TVP 資助採用科技服務及方案，不適用於一般營運開支。",
  },
  {
    id: "registered-provider",
    question: "是否計劃使用已登記的 TVP 服務供應商？",
    hint: "申請須透過創新科技署登記名單內的服務供應商。",
    required: true,
    failMessage: "TVP 要求使用已登記的服務供應商。",
  },
  {
    id: "cost-sharing",
    question: "企業是否願意承擔項目成本 25%（政府資助 75%）？",
    required: true,
    failMessage: "TVP 資助比例為 75%，企業須自付 25%。",
  },
  {
    id: "funding-cap",
    question: "企業累計 TVP 資助是否仍在 HK$60 萬上限以內？",
    hint: "每間企業累計資助上限為 HK$60 萬。",
    required: true,
    failMessage: "已達或超出 TVP 累計資助上限的企業不可再申請。",
  },
  {
    id: "quotation-ready",
    question: "能否取得服務供應商的報價及項目方案？",
    required: false,
    failMessage: "建議預先向 TVP 服務供應商取得報價。",
  },
];

/** 參考 BUD 專項基金要求 */
export const BUD_ELIGIBILITY_QUESTIONS: EligibilityQuestion[] = [
  COMMON_HK_REGISTERED,
  COMMON_NON_LISTED,
  {
    id: "expansion-plan",
    question:
      "是否有明確的品牌發展、升級轉型或拓展市場計劃（如內銷、東盟等）？",
    hint: "BUD 支援品牌、升級轉型及拓展內銷／指定海外市場。",
    required: true,
    failMessage: "BUD 要求有明確的品牌／升級／市場拓展項目方向。",
  },
  {
    id: "target-market",
    question: "項目是否針對指定市場（如內地、東盟或其他經合組織市場）？",
    required: true,
    failMessage: "BUD 項目須對準指定拓展市場，不可僅限本地一般宣傳。",
  },
  {
    id: "cost-sharing",
    question: "企業是否願意承擔不少於項目總成本 50%？",
    required: true,
    failMessage: "BUD 政府資助比例一般為 50%，餘下由企業自付。",
  },
  {
    id: "project-budget",
    question: "能否準備項目預算、時間表及執行計劃？",
    required: true,
    failMessage: "詳細項目計劃及預算為 BUD 申請核心文件。",
  },
  {
    id: "brand-materials",
    question: "能否提供現有品牌或產品資料（如網站、目錄、宣傳品）？",
    required: false,
    failMessage: "建議預先整理現有品牌及產品資料。",
  },
  {
    id: "financials",
    question: "能否提供最近年度財務報表或營運證明？",
    required: false,
    failMessage: "建議預先準備財務及營運證明文件。",
  },
];

/** 參考工業貿易署 EMF 要求 */
export const EMF_ELIGIBILITY_QUESTIONS: EligibilityQuestion[] = [
  COMMON_HK_REGISTERED,
  COMMON_NON_LISTED,
  {
    id: "export-business",
    question: "企業是否已有出口業務，或正計劃拓展出口市場？",
    hint: "EMF 資助出口推廣活動，須與出口業務相關。",
    required: true,
    failMessage: "EMF 適用於從事出口或有意拓展出口市場的企業。",
  },
  {
    id: "promotion-activity",
    question:
      "項目是否涉及出口推廣活動（如本地／海外展覽、網上推廣、產品目錄等）？",
    required: true,
    failMessage: "EMF 資助出口推廣活動，一般營運開支不在資助範圍。",
  },
  {
    id: "cost-sharing",
    question: "企業是否願意承擔推廣成本 50%（政府資助 50%）？",
    required: true,
    failMessage: "EMF 資助比例為 50%，企業須自付 50%。",
  },
  {
    id: "funding-cap",
    question: "企業累計 EMF 資助是否仍在 HK$80 萬上限以內？",
    hint: "每間企業累計資助上限為 HK$80 萬。",
    required: true,
    failMessage: "已達或超出 EMF 累計資助上限的企業不可再申請。",
  },
  {
    id: "activity-proof",
    question: "能否提供過往出口或推廣活動證明（如發票、合約、展覽記錄）？",
    required: false,
    failMessage: "建議預先整理出口及推廣活動證明。",
  },
  {
    id: "quotation-ready",
    question: "能否取得推廣服務供應商或展覽主辦方的報價？",
    required: false,
    failMessage: "建議預先取得相關報價以支持申請。",
  },
];

export const FUND_QUIZ_CONFIGS: Record<FundSchemeId, FundQuizConfig> = {
  ess: {
    id: "ess",
    shortName: "ESS",
    schemeName: "ESS 企業支援計劃",
    authority: "創新科技署",
    questions: ESS_ELIGIBILITY_QUESTIONS,
    documentChecklist: [
      "公司註冊證書、商業登記證",
      "項目計劃書（技術、時間表、預算）",
      "最近年度財務報表",
      "實質業務運作證明（MPF、合約等）",
      "管理層及研發團隊簡介",
    ],
    notEligibleTitle: "暫未符合 ESS 基本申請條件",
    notEligibleSummary:
      "根據您的回答，目前可能未符合企業支援計劃（ESS）的基本條件。VCG 可協助了解其他政府資助或融資方案。",
    partialTitle: "基本方向符合，建議完善文件",
    partialSummary:
      "您大致符合 ESS 的申請方向，但部分文件建議預先準備。VCG 可協助初步評估及申請策劃。",
    eligibleTitle: "初步符合 ESS 申請條件",
    eligibleSummary:
      "根據初步評估，您的企業符合企業支援計劃（ESS）的主要條件。最終批核仍由創新科技署審核。",
  },
  tvp: {
    id: "tvp",
    shortName: "TVP",
    schemeName: "科技券（TVP）",
    authority: "創新科技署",
    questions: TVP_ELIGIBILITY_QUESTIONS,
    documentChecklist: [
      "公司註冊證書、商業登記證",
      "TVP 服務供應商報價及方案",
      "項目預算及時間表",
      "實質業務運作證明",
      "最近銀行月結單（如適用）",
    ],
    notEligibleTitle: "暫未符合 TVP 基本申請條件",
    notEligibleSummary:
      "根據您的回答，目前可能未符合科技券（TVP）的基本條件。VCG 可協助了解 ESS 或其他資助方案。",
    partialTitle: "基本方向符合，建議完善文件",
    partialSummary:
      "您大致符合 TVP 的申請方向，但部分文件建議預先準備。VCG 可協助配對 TVP 服務供應商及申請策劃。",
    eligibleTitle: "初步符合 TVP 申請條件",
    eligibleSummary:
      "根據初步評估，您的企業符合科技券（TVP）的主要條件。最終批核仍由創新科技署審核。",
  },
  bud: {
    id: "bud",
    shortName: "BUD",
    schemeName: "BUD 專項基金",
    authority: "貿易及物流局／香港生產力促進局",
    questions: BUD_ELIGIBILITY_QUESTIONS,
    documentChecklist: [
      "公司註冊證書、商業登記證",
      "品牌／升級／市場拓展項目計劃書",
      "項目預算及時間表",
      "現有品牌或產品資料",
      "最近年度財務報表",
    ],
    notEligibleTitle: "暫未符合 BUD 基本申請條件",
    notEligibleSummary:
      "根據您的回答，目前可能未符合 BUD 專項基金的基本條件。VCG 可協助了解其他政府資助方案。",
    partialTitle: "基本方向符合，建議完善文件",
    partialSummary:
      "您大致符合 BUD 的申請方向，但部分文件建議預先準備。VCG 可協助初步評估及申請策劃。",
    eligibleTitle: "初步符合 BUD 申請條件",
    eligibleSummary:
      "根據初步評估，您的企業符合 BUD 專項基金的主要條件。最終批核以香港生產力促進局審核為準。",
  },
  emf: {
    id: "emf",
    shortName: "EMF",
    schemeName: "中小企市場推廣基金（EMF）",
    authority: "工業貿易署",
    questions: EMF_ELIGIBILITY_QUESTIONS,
    documentChecklist: [
      "公司註冊證書、商業登記證",
      "出口或推廣活動計劃及預算",
      "展覽／推廣服務供應商報價",
      "過往出口或推廣證明",
      "最近年度財務報表（如適用）",
    ],
    notEligibleTitle: "暫未符合 EMF 基本申請條件",
    notEligibleSummary:
      "根據您的回答，目前可能未符合 EMF 的基本條件。VCG 可協助了解其他出口推廣或資助方案。",
    partialTitle: "基本方向符合，建議完善文件",
    partialSummary:
      "您大致符合 EMF 的申請方向，但部分文件建議預先準備。VCG 可協助初步評估及申請策劃。",
    eligibleTitle: "初步符合 EMF 申請條件",
    eligibleSummary:
      "根據初步評估，您的企業符合 EMF 的主要條件。最終批核仍由工業貿易署審核。",
  },
};

export const FUND_QUIZ_SCHEME_ORDER: FundSchemeId[] = [
  "ess",
  "tvp",
  "bud",
  "emf",
];

export function evaluateFundEligibility(
  config: FundQuizConfig,
  answers: Record<string, EligibilityAnswer>,
): EligibilityResult {
  const failedItems: string[] = [];
  const warnings: string[] = [];

  for (const q of config.questions) {
    const answer = answers[q.id];
    if (!answer || answer === "unsure") {
      if (q.required) {
        failedItems.push(`${q.question}（請確認）`);
      } else {
        warnings.push(q.failMessage);
      }
      continue;
    }

    if (answer === "no") {
      if (q.required) {
        failedItems.push(q.failMessage);
      } else {
        warnings.push(q.failMessage);
      }
    }
  }

  const requiredQuestions = config.questions.filter((q) => q.required);
  const passedRequired = requiredQuestions.filter(
    (q) => answers[q.id] === "yes",
  ).length;

  if (failedItems.length > 0) {
    return {
      status: "not-eligible",
      title: config.notEligibleTitle,
      summary: config.notEligibleSummary,
      passedCount: passedRequired,
      totalRequired: requiredQuestions.length,
      failedItems,
      warnings,
    };
  }

  if (warnings.length > 0) {
    return {
      status: "partial",
      title: config.partialTitle,
      summary: config.partialSummary,
      passedCount: passedRequired,
      totalRequired: requiredQuestions.length,
      failedItems: [],
      warnings,
    };
  }

  return {
    status: "eligible",
    title: config.eligibleTitle,
    summary: config.eligibleSummary,
    passedCount: passedRequired,
    totalRequired: requiredQuestions.length,
    failedItems: [],
    warnings: [],
  };
}

/** @deprecated 使用 evaluateFundEligibility(FUND_QUIZ_CONFIGS.ess, answers) */
export function evaluateEssEligibility(
  answers: Record<string, EligibilityAnswer>,
): EligibilityResult {
  return evaluateFundEligibility(FUND_QUIZ_CONFIGS.ess, answers);
}
