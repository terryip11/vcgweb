const faqs = [
  {
    q: "業主貸款是什麼？",
    a: "專為擁有物業人士而設的無抵押私人貸款，毋須抵押物業即可借貸，手續比銀行加按更簡便。",
  },
  {
    q: "對中小業主有什麼好處？",
    a: "公屋、居屋業主無需經複雜加按程序，可快速取得營運資金，且不會在土地註冊處登記。",
  },
  {
    q: "申請資格？",
    a: "必須是業主，無論物業是否供完均可申請。VCG 提供獨家審批動向情報。",
  },
  {
    q: "與銀行按揭的分別？",
    a: "傳統按揭需在田土廳登記；業主貸款無需登記，私隱性更高，批核速度通常更快。",
  },
];

export default function OwnerLoanSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="mb-2 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
              VCG 獨家方案
            </span>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              業主 + 企業聯動貸款
            </h2>
            <p className="mt-2 max-w-xl text-slate-500">
              免抵押業主貸款最高達物業估值 80%，配合企業現金流需求靈活配對。
            </p>
          </div>
          <a
            href="https://wa.me/85264754756?text=你好，我想查詢業主貸款"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-slate-900 transition hover:bg-amber-400"
          >
            立即申請業主貸款
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-5"
            >
              <h3 className="mb-2 font-bold text-slate-900">{faq.q}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
