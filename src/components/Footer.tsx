import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-900 py-12 text-slate-400">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 grid gap-8 sm:grid-cols-3">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                VCG
              </div>
              <span className="font-bold text-white">創健佳商業事務所</span>
            </div>
            <p className="text-sm leading-relaxed">
              香港私人貸款及中小企融資配對平台，協助您找到最合適的財務方案。
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">產品</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/compare" className="hover:text-white">
                  私人貸款比較
                </Link>
              </li>
              <li>
                <Link href="/sme" className="hover:text-white">
                  政府中小企融資
                </Link>
              </li>
              <li>
                <Link href="/funds" className="hover:text-white">
                  基金申請
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="hover:text-white">
                  貸款計算機
                </Link>
              </li>
              <li>
                <Link href="/partner" className="hover:text-white">
                  推廣夥伴
                </Link>
              </li>
              <li>
                <Link href="/lenders" className="hover:text-white">
                  貸款機構合作
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">法律</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-white">
                  私隱條款
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-white">
                  免責聲明
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 text-xs leading-relaxed">
          <p className="mb-2">
            © {new Date().getFullYear()} Value Creation Business Firm. All
            rights reserved.
          </p>
          <p>
            聲明：VCG 致力確保網站資訊準確，惟所顯示的金融產品資訊僅供參考，並非提供財務建議。考慮申請產品前，建議查閱官方條款及細則。VCG
            為配對平台，不參與貸款審批，審批由相關金融機構負責。
          </p>
        </div>
      </div>
    </footer>
  );
}
