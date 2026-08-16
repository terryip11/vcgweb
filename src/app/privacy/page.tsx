import type { Metadata } from "next";
import Link from "next/link";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "私隱政策 | VCG",
  description: "VCG 私隱政策 — 說明我們如何收集、使用及保護您的個人資料。",
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="私隱政策" updated="2026年8月2日">
      <p>
        VCG（「我們」）重視您的私隱。本政策說明當您使用本網站及相關服務時，我們如何處理個人資料。
      </p>

      <h2 className="text-lg font-bold text-slate-900">1. 收集的資料</h2>
      <p>我們可能收集以下資料：</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>聯絡資料：姓名、電話、電郵、公司名稱</li>
        <li>申請及查詢資料：貸款類別、金額、問卷結果、備註</li>
        <li>帳戶資料：登入電郵、Google 頭像及顯示名稱（如適用）</li>
        <li>技術資料：IP、瀏覽器類型、推廣來源（ref）、點擊記錄</li>
        <li>上傳文件：您主動提交的支持文件（儲存於加密雲端儲存）</li>
      </ul>

      <h2 className="text-lg font-bold text-slate-900">2. 使用目的</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>處理貸款、基金申請及推廣夥伴查詢</li>
        <li>配對合適的貸款產品或政府資助方案</li>
        <li>會員帳戶管理及查詢進度通知</li>
        <li>推廣夥伴佣金統計及結算（如適用）</li>
        <li>改善網站功能及防止濫用</li>
      </ul>

      <h2 className="text-lg font-bold text-slate-900">3. 資料分享</h2>
      <p>
        我們可能將必要資料分享予參與的貸款機構、政府計劃顧問或服務供應商，以跟進您的申請。我們不會出售您的個人資料予第三方作直接促銷。
      </p>

      <h2 className="text-lg font-bold text-slate-900">4. 資料保存</h2>
      <p>
        查詢及會員資料會按業務需要及法律要求保存。您可聯絡我們要求查閱或更正資料。
      </p>

      <h2 className="text-lg font-bold text-slate-900">5. Cookie 及類似技術</h2>
      <p>
        我們使用 Cookie 及 localStorage 記錄推廣來源（ref）及登入狀態。您可透過瀏覽器設定管理 Cookie。
      </p>

      <h2 className="text-lg font-bold text-slate-900">6. 聯絡我們</h2>
      <p>
        如有私隱相關查詢，請 WhatsApp{" "}
        <a
          href="https://wa.me/85264754756"
          className="font-semibold text-blue-600 hover:underline"
        >
          +852 6475 4756
        </a>{" "}
        或電郵 vcgrouphk@gmail.com。
      </p>

      <p className="text-slate-500">
        另請參閱{" "}
        <Link href="/disclaimer" className="text-blue-600 hover:underline">
          免責聲明
        </Link>
        。
      </p>
    </LegalPageLayout>
  );
}
