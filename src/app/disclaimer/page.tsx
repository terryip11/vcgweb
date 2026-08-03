import type { Metadata } from "next";
import Link from "next/link";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "免責聲明 | 創健佳商業事務所 | VCG",
  description: "VCG 網站免責聲明 — 貸款比較、資格問卷及基金申請資訊僅供參考。",
};

export default function DisclaimerPage() {
  return (
    <LegalPageLayout title="免責聲明" updated="2026年8月2日">
      <p>
        歡迎使用創健佳商業事務所（VCG）網站。使用本網站即表示您理解並同意以下免責條款。
      </p>

      <h2 className="text-lg font-bold text-slate-900">1. 資訊性質</h2>
      <p>
        本網站提供的貸款產品比較、APR 估算、資格問卷（包括 SME 八成信貸擔保、ESS / BUD / EMF 等）及基金申請資訊<strong>僅供初步參考</strong>，不構成貸款、擔保或政府資助的批核保證、法律意見或財務建議。
      </p>

      <h2 className="text-lg font-bold text-slate-900">2. 產品及利率</h2>
      <p>
        貸款產品資料由相關機構提供或公開資料整理，實際利率、費用、批核條件及優惠以貸款機構最終批核為準。VCG 致力保持資料準確，但不保證即時性或完整性。
      </p>

      <h2 className="text-lg font-bold text-slate-900">3. 政府計劃</h2>
      <p>
        政府資助計劃（ESS、BUD、EMF 等）的最終資格及批核以各政府部門及執行機構審核為準。問卷結果不代表官方審批結果。
      </p>

      <h2 className="text-lg font-bold text-slate-900">4. 第三方連結</h2>
      <p>
        本網站可能包含第三方網站連結。VCG 不對第三方內容或服務負責。
      </p>

      <h2 className="text-lg font-bold text-slate-900">5. 推廣夥伴</h2>
      <p>
        推廣夥伴佣金以書面協議及 VCG 月結對賬為準。後台顯示的估算佣金不代表最終支付承諾。詳見{" "}
        <Link href="/partner/terms" className="text-blue-600 hover:underline">
          推廣夥伴條款
        </Link>
        。
      </p>

      <h2 className="text-lg font-bold text-slate-900">6. 慎防詐騙</h2>
      <p>
        請只向參與計劃的認可貸款機構申請，切勿向不明第三方支付「代辦費」。VCG 為配對及顧問平台，不會要求您轉帳至個人戶口作為貸款前置條件。
      </p>

      <h2 className="text-lg font-bold text-slate-900">7. 責任限制</h2>
      <p>
        在法律允許的最大範圍內，VCG 對因使用本網站資訊而產生的任何直接、間接或附帶損失不承擔責任。
      </p>

      <p className="text-slate-500">
        另請參閱{" "}
        <Link href="/privacy" className="text-blue-600 hover:underline">
          私隱政策
        </Link>
        。
      </p>
    </LegalPageLayout>
  );
}
