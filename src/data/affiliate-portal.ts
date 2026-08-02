export const AFFILIATE_LINK_TARGETS = [
  { path: "/compare", label: "私人貸款比較" },
  { path: "/sme", label: "中小企融資" },
  { path: "/funds", label: "政府基金申請" },
  { path: "/calculator", label: "貸款計算機" },
  { path: "/owner", label: "業主貸款" },
] as const;

export const AFFILIATE_PROMO_COPY = [
  {
    id: "pl",
    title: "私人貸款比較",
    text: "【VCG 私人貸款比較】一站式比較多家銀行及財務公司 APR，VCG 客戶享專人免費跟進 👉 {link}",
  },
  {
    id: "sme",
    title: "中小企融資",
    text: "【政府八成信貸擔保】中小企融資資格免費評估，VCG 協助配對及申請跟進 👉 {link}",
  },
  {
    id: "funds",
    title: "政府基金",
    text: "【ESS / 科技券】政府資助計劃資格自測，VCG 免費初步評估 👉 {link}",
  },
] as const;
