export const AFFILIATE_COMMISSION_MODELS = [
  {
    id: "cpl",
    title: "CPL · 有效查詢",
    badge: "Phase 1 主推",
    desc: "用戶透過您的專屬連結提交有效查詢（姓名 + 電話 + 意向），即可計算佣金。",
    note: "結算以 VCG 人工審核為準，排除重複及無效查詢。",
  },
  {
    id: "cpa",
    title: "CPA · 成功批核",
    badge: "高佣金",
    desc: "客戶成功批核貸款或完成指定轉化後，按產品線支付更高佣金。",
    note: "適合有穩定企業客戶資源的推廣夥伴，週期較長。",
  },
] as const;

export const AFFILIATE_AUDIENCE_TYPES = [
  { id: "kol", label: "KOL / 網紅" },
  { id: "blog", label: "理財博客 / 自媒體" },
  { id: "website", label: "網站 / App 流量主" },
  { id: "business", label: "企業服務 / 會計 / 秘書" },
  { id: "other", label: "其他" },
] as const;

export const AFFILIATE_PROMOTABLE_PAGES = [
  {
    href: "/compare",
    title: "私人貸款比較",
    desc: "高流量入口，適合理財 KOL",
  },
  {
    href: "/sme",
    title: "中小企融資",
    desc: "佣金潛力高，適合 B2B 渠道",
  },
  {
    href: "/funds",
    title: "政府基金申請",
    desc: "ESS、科技券等資助計劃",
  },
  {
    href: "/calculator",
    title: "貸款計算機",
    desc: "低門檻引流工具",
  },
] as const;

export const AFFILIATE_FAQ = [
  {
    q: "如何開始賺取佣金？",
    a: "提交申請 → VCG 審核 → 獲得專屬 ref 代碼 → 分享帶 ?ref= 的連結 → 有效查詢計佣。",
  },
  {
    q: "佣金何時結算？",
    a: "Phase 1 採每月人工對賬，T+30 結算。詳細比例於審核通過後以書面協議為準。",
  },
  {
    q: "可以推廣哪些內容？",
    a: "可分享 VCG 公開頁面連結。請勿誤導利率、假批核承諾或使用未授權素材。",
  },
  {
    q: "與貸款機構合作有何不同？",
    a: "推廣夥伴（Affiliate）負責導流賺佣；貸款機構合作為 B2B 接單，請見「貸款機構合作」頁面。",
  },
] as const;

export const AFFILIATE_HOW_IT_WORKS = [
  { step: 1, title: "申請加入", desc: "填寫推廣渠道及聯絡方式" },
  { step: 2, title: "VCG 審核", desc: "1–3 個工作天內回覆" },
  { step: 3, title: "取得專屬代碼", desc: "例如 ?ref=YOURCODE" },
  { step: 4, title: "分享賺佣", desc: "追蹤點擊與查詢，按月結算" },
] as const;
