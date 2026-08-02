export type EligibilityAnswer = "yes" | "no" | "unsure";

export interface EligibilityQuestion {
  id: string;
  question: string;
  hint?: string;
  /** 必須回答「是」才可符合基本資格 */
  required: boolean;
  /** 若回答「否」或「不確定」時的提示 */
  failMessage: string;
}

/** 參考香港按證保險有限公司「中小企融資擔保計劃」八成信貸擔保產品 */
export const SME_80_ELIGIBILITY_QUESTIONS: EligibilityQuestion[] = [
  {
    id: "hk-registered",
    question: "您的企業是否在香港註冊，並持有有效的商業登記證？",
    hint: "本計劃旨在協助本地中小企及非上市企業取得融資。",
    required: true,
    failMessage: "須為在香港註冊的企業方可申請。",
  },
  {
    id: "operating-12m",
    question: "公司是否已持續營運最少 12 個月？",
    hint: "八成信貸擔保產品要求企業已有一定經營記錄。",
    required: true,
    failMessage: "營運未滿 12 個月可能不符合八成計劃基本要求。",
  },
  {
    id: "non-listed",
    question: "企業是否為非上市公司？",
    hint: "計劃適用於本地中小企及非上市企業。",
    required: true,
    failMessage: "上市公司一般不屬於本計劃目標企業。",
  },
  {
    id: "business-purpose",
    question:
      "貸款用途是否用於業務需要（例如營運周轉、租金、薪金、設備或拓展）？",
    hint: "擔保貸款須用於應付業務需要，提升生產力及競爭力。",
    required: true,
    failMessage: "貸款須用於業務用途，不可作純私人消費。",
  },
  {
    id: "personal-guarantee",
    question: "持有 50% 或以上股權的股東／東主是否願意提供個人擔保？",
    hint: "八成計劃一般要求主要股東提供個人擔保。",
    required: true,
    failMessage: "主要股東個人擔保為常見必要條件。",
  },
  {
    id: "loan-amount",
    question: "所需貸款金額是否在 HK$1,800 萬或以下？",
    hint: "八成信貸擔保產品最高貸款額為 HK$1,800 萬。",
    required: true,
    failMessage: "超出計劃上限的貸款額需另作安排。",
  },
  {
    id: "bank-statements",
    question: "能否提供最近 6 個月主要銀行月結單？",
    hint: "貸款機構進行盡職審查時的基本文件。",
    required: true,
    failMessage: "銀行月結單為申請時常見必需文件。",
  },
  {
    id: "company-docs",
    question: "如屬有限公司，能否提供公司註冊證書及商業登記證？",
    hint: "獨資／合伙經營者提供商業登記證即可。",
    required: false,
    failMessage: "建議預先準備公司註冊相關文件。",
  },
  {
    id: "financial-statements",
    question: "能否提供最近一年的財務報表（如適用）？",
    hint: "視乎企業規模及貸款機構要求而定。",
    required: false,
    failMessage: "部分個案可能需要財務報表，建議預先整理。",
  },
  {
    id: "direct-lender",
    question: "您是否明白須向參與計劃的貸款機構申請，並提防收費代辦詐騙？",
    hint: "按證保險公司呼籲勿委任不明第三方代辦；VCG 為配對平台，協助對接貸款機構。",
    required: true,
    failMessage: "請只透過認可貸款機構申請，慎防詐騙。",
  },
];

export interface EligibilityResult {
  status: "eligible" | "partial" | "not-eligible";
  title: string;
  summary: string;
  passedCount: number;
  totalRequired: number;
  failedItems: string[];
  warnings: string[];
}

export function evaluateSme80Eligibility(
  answers: Record<string, EligibilityAnswer>,
): EligibilityResult {
  const failedItems: string[] = [];
  const warnings: string[] = [];

  for (const q of SME_80_ELIGIBILITY_QUESTIONS) {
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

  const requiredQuestions = SME_80_ELIGIBILITY_QUESTIONS.filter(
    (q) => q.required,
  );
  const passedRequired = requiredQuestions.filter(
    (q) => answers[q.id] === "yes",
  ).length;

  if (failedItems.length > 0) {
    return {
      status: "not-eligible",
      title: "暫未符合八成信貸擔保基本資格",
      summary:
        "根據您的回答，目前可能未符合八成信貸擔保產品的基本條件。您仍可聯絡 VCG 了解其他中小企融資方案。",
      passedCount: passedRequired,
      totalRequired: requiredQuestions.length,
      failedItems,
      warnings,
    };
  }

  if (warnings.length > 0) {
    return {
      status: "partial",
      title: "基本資格符合，建議補充文件",
      summary:
        "您大致符合八成信貸擔保產品的申請方向，但部分文件或資料建議預先準備。VCG 可協助初步評估及配對接貸機構。",
      passedCount: passedRequired,
      totalRequired: requiredQuestions.length,
      failedItems: [],
      warnings,
    };
  }

  return {
    status: "eligible",
    title: "符合八成信貸擔保基本申請條件",
    summary:
      "根據初步評估，您的企業符合八成信貸擔保產品的主要條件。最終審批仍由貸款機構及按證保險公司審核。",
    passedCount: passedRequired,
    totalRequired: requiredQuestions.length,
    failedItems: [],
    warnings: [],
  };
}
