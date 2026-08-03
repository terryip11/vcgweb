import type { Metadata } from "next";
import Link from "next/link";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "推廣夥伴條款 | 創健佳商業事務所 | VCG",
  description: "VCG 推廣夥伴（Affiliate）計劃條款 — 佣金、結算及推廣規範。",
};

export default function PartnerTermsPage() {
  return (
    <LegalPageLayout title="推廣夥伴條款" updated="2026年8月3日">
      <p>
        以下條款適用於 VCG 推廣夥伴（Affiliate）計劃。提交申請或開始推廣即表示您同意本條款。
      </p>

      <h2 className="text-lg font-bold text-slate-900">1. 夥伴資格</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>須為香港合法經營或具推廣能力的個人／機構</li>
        <li>須提供真實聯絡資料，並使用與 VCG 會員帳戶相同的電郵登入後台</li>
        <li>VCG 保留批准、暫停或終止夥伴資格的權利</li>
      </ul>

      <h2 className="text-lg font-bold text-slate-900">2. 推廣方式</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>須使用 VCG 分配的專屬 ref 連結追蹤成效</li>
        <li>不得虛假宣傳、誤導利率或保證批核</li>
        <li>不得使用 spam、未授權的個人資料名單或侵犯知識產權的素材</li>
        <li>不得自行競價 VCG 品牌關鍵字（除非書面授權）</li>
      </ul>

      <h2 className="text-lg font-bold text-slate-900">3. 佣金及結算</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>佣金模式（如 CPL）於批准時由 VCG 書面或後台設定</li>
        <li>有效查詢定義以 VCG 內部審核為準（重複、無效或欺詐查詢不計）</li>
        <li>
          推廣點擊及有效查詢<strong>僅統計香港 IP 地址</strong>（由 Cloudflare
          等 CDN 判定）；海外、VPN 或非本地 IP 流量不計入後台數字及佣金估算
        </li>
        <li>
          同一香港 IP 對同一 ref 連結，<strong>24 小時內只計 1 次有效點擊</strong>
        </li>
        <li>
          同一電話號碼，<strong>24 小時內只計 1 宗有效查詢</strong>（全站去重）
        </li>
        <li>結算週期一般為每月一次，VCG 人工對賬後更新後台記錄</li>
        <li>後台「待結算（估算）」僅供參考，不構成支付承諾</li>
        <li>支付以雙方確認的月結記錄及書面協議為準</li>
      </ul>

      <h2 className="text-lg font-bold text-slate-900">3a. CPA 成功批核獎賞（1%）</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          客戶須透過夥伴專屬 ref 連結提交查詢，並由 VCG 配對<strong>成功批核</strong>貸款
        </li>
        <li>
          批核日起計<strong>連續 3 個月</strong>正常還款，期間無欠供、無提早清還或退款
        </li>
        <li>
          符合條件者，VCG 按<strong>成功批核貸款本金 × 1%</strong>
          向夥伴發放額外佣金（CPA）
        </li>
        <li>CPA 可與 CPL 查詢佣金並存；適用產品線以 VCG 書面協議為準</li>
        <li>
          CPA 須待觀察期滿後由 VCG 向貸款機構核實還款紀錄，確認後計入月結；後台即時數字僅反映
          CPL 部分
        </li>
        <li>VCG 不保證任何客戶必定批核；夥伴不得作出批核承諾或誤導利率</li>
      </ul>

      <h2 className="text-lg font-bold text-slate-900">4. 資料及私隱</h2>
      <p>
        夥伴後台可查看與其 ref 相關的匿名化統計及查詢摘要。夥伴不得向第三方披露 VCG 客戶完整個人資料。
      </p>

      <h2 className="text-lg font-bold text-slate-900">5. 終止</h2>
      <p>
        任一方可終止合作。終止後，已產生但未結算的合法佣金（如有）按協議處理；欺詐或違規推廣不予結算。
      </p>

      <h2 className="text-lg font-bold text-slate-900">6. 條款修訂</h2>
      <p>
        VCG 可修訂本條款，修訂後繼續使用後台或推廣連結即視為接受。
      </p>

      <p>
        申請成為推廣夥伴：{" "}
        <Link href="/partner#apply" className="font-semibold text-teal-600 hover:underline">
          /partner
        </Link>
      </p>
    </LegalPageLayout>
  );
}
