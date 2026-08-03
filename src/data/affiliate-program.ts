export const AFFILIATE_COMMISSION_MODELS = [
  {
    id: "cpl",
    title: "CPL · 有效查詢",
    badge: "Phase 1 即時",
    desc: "用戶透過您的專屬連結、以香港 IP 提交有效查詢（姓名 + 電話 + 意向），即可按約定 CPL 計算佣金。",
    note: "僅統計香港本地 IP；海外或 VPN 流量不計。結算以 VCG 人工審核為準，排除重複及無效查詢。",
  },
  {
    id: "cpa",
    title: "CPA · 成功批核獎賞",
    badge: "1% 額外回報",
    desc: "客戶透過您的 ref 成功批核貸款，且批核後連續 3 個月正常還款、無欠供及無提早清還／退款，VCG 按成功批核貸款本金的 1% 向夥伴發放額外佣金。",
    note: "批核及還款紀錄由 VCG 向貸款機構核實；滿 3 個月觀察期後人工對賬結算。可與 CPL 並存，以書面協議為準。",
  },
] as const;

/** 夥伴後台及條款共用的 CPA 成功批核獎賞說明 */
export const AFFILIATE_CPA_SUCCESS_BONUS = {
  rateLabel: "1%",
  basis: "成功批核貸款本金",
  observationMonths: 3,
  conditions: [
    "客戶須透過夥伴專屬 ref 連結提交查詢，並由 VCG 配對成功批核",
    "批核日起計連續 3 個月正常還款",
    "觀察期內無欠供、無提早清還或退款",
    "僅適用 VCG 書面同意之貸款產品線（私人貸款、中小企融資等）",
  ],
  settlementNote:
    "CPA 獎賞不會即時顯示於後台估算；VCG 於觀察期滿後人工核實，確認符合條件後計入月結記錄。",
  disclaimer:
    "VCG 不保證任何客戶必定批核；推廣素材不得作出批核承諾或誤導利率。",
} as const;

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
    desc: "ESS、BUD、EMF 等資助計劃",
  },
  {
    href: "/calculator",
    title: "貸款計算機",
    desc: "低門檻引流工具",
  },
] as const;

export const AFFILIATE_FAQ = [
  {
    q: "CPA 成功批核 1% 獎賞如何計算？",
    a: "客戶透過您的 ref 成功批核貸款後，若批核日起計連續 3 個月正常還款、無欠供及無提早清還／退款，VCG 按成功批核貸款本金的 1% 向夥伴發放額外佣金。此為 CPA 獎賞，可與 CPL 查詢佣金並存；滿觀察期後由 VCG 人工核實並更新結算記錄，後台估算僅反映 CPL 部分。",
  },
  {
    q: "哪些點擊和查詢會計入佣金？",
    a: "僅計香港 IP 的點擊及查詢（網站經 Cloudflare 判定所在地）。同一香港 IP 對同一 ref 連結 24 小時內只計 1 次有效點擊；同一電話 24 小時內只計 1 宗有效查詢。海外、VPN 或非本地 IP 不計入後台數字；有效查詢另須通過 VCG 人工審核（排除重複及無效）。",
  },
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
  { step: 4, title: "分享賺佣", desc: "CPL 查詢佣金 + 成功批核 1% 額外獎賞" },
] as const;
