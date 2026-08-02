export const OTHER_LENDER = "其它";

export interface LenderGroup {
  label: string;
  options: string[];
}

/** 香港主要銀行及財務公司（VCG 合作伙伴） */
export const LENDER_GROUPS: LenderGroup[] = [
  {
    label: "銀行",
    options: [
      "HSBC 滙豐銀行",
      "渣打銀行",
      "中國銀行（香港）",
      "恒生銀行",
      "大新銀行",
      "東亞銀行",
      "花旗銀行",
      "星展銀行 DBS",
      "華僑銀行 OCBC",
      "信銀國際",
      "創興銀行",
      "上海商業銀行",
      "南洋商業銀行",
      "集友銀行",
      "富邦銀行",
    ],
  },
  {
    label: "虛擬銀行",
    options: [
      "Mox Bank",
      "WeLab Bank 匯立銀行",
      "ZA Bank 眾安銀行",
      "天星銀行",
      "livi bank 理慧銀行",
      "富融銀行",
    ],
  },
  {
    label: "財務公司",
    options: [
      "大眾財務",
      "UA 亞洲聯合財務",
      "OK 財務",
      "安信信貸",
      "邦民日本財務",
      "WeLend",
      "CreFIT 維信",
      "X Wallet",
      "平安普惠",
    ],
  },
];

export const ALL_LENDERS = LENDER_GROUPS.flatMap((g) => g.options);

export function getLenderDisplayName(bank: string, bankOther?: string): string {
  if (bank === OTHER_LENDER) {
    return bankOther?.trim() || OTHER_LENDER;
  }
  return bank;
}

export function normalizeLenderValue(
  bank: string,
  bankOther?: string,
): { bank: string; bankOther: string } {
  if (bank === OTHER_LENDER) {
    return { bank: OTHER_LENDER, bankOther: bankOther ?? "" };
  }
  if (ALL_LENDERS.includes(bank)) {
    return { bank, bankOther: "" };
  }
  if (bank.trim()) {
    return { bank: OTHER_LENDER, bankOther: bank };
  }
  return { bank: "", bankOther: "" };
}
