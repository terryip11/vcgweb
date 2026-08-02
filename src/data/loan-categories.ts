export const OTHER_CATEGORY = "其它";

/** 分期貸款類別 */
export const TERM_LOAN_CATEGORIES = [
  "私人貸款",
  "業主貸款",
  "稅季貸款",
  "中小企貸款",
  "小商務貸款",
  "物業按揭",
  "汽車貸款",
  "結餘轉戶",
  "免入息貸款",
  "免 TU 貸款",
  "循環貸款",
] as const;

/** 循環 / 卡數類別（含預設月利率，對應 Excel VLOOKUP） */
export const REVOLVING_CATEGORY_OPTIONS = [
  { value: "Card", label: "Card（信用卡）", rate: 0.035 },
  { value: "循環借貸", label: "循環借貸", rate: 0.035 },
  { value: "卡數結餘", label: "卡數結餘", rate: 0.035 },
  { value: "透支", label: "透支", rate: 0.035 },
] as const;

export const REVOLVING_RATES: Record<string, number> = Object.fromEntries(
  REVOLVING_CATEGORY_OPTIONS.map((o) => [o.value, o.rate]),
);

export function getCategoryDisplayName(
  category: string,
  categoryOther?: string,
): string {
  if (category === OTHER_CATEGORY) {
    return categoryOther?.trim() || OTHER_CATEGORY;
  }
  return category;
}

export function getRevolvingRate(category: string, customRate?: number): number {
  if (!category) return 0;
  if (category === OTHER_CATEGORY && customRate != null && customRate > 0) {
    return customRate / 100;
  }
  return REVOLVING_RATES[category] ?? 0;
}
