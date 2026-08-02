const partners = [
  "大眾財務",
  "UA 亞洲聯合",
  "OK 財務",
  "安信信貸",
  "大新銀行",
  "WeLend",
];

export default function LenderPartnerSection() {
  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            誠邀銀行及財務公司夥伴
          </h2>
          <p className="mt-2 text-slate-500">
            專注中小企貸款、私人貸款及物業按揭需求，穩定客源助您拓展業務
          </p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {partners.map((p) => (
            <span
              key={p}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600"
            >
              {p}
            </span>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "風險篩選",
              desc: "客戶均經過初步財務評估，降低壞賬風險",
            },
            {
              title: "審批流程",
              desc: "由銀行和財務公司直接跟進，我們不參與審批",
            },
            {
              title: "合作優勢",
              desc: "歡迎 SME Loan、P Loan、Mortgage 業務員洽談",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-100 p-5 text-center"
            >
              <h3 className="mb-2 font-bold text-slate-900">{item.title}</h3>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="https://wa.me/85264754756?text=你好，我想洽談貸款機構合作"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-xl border-2 border-blue-600 px-6 py-3 text-sm font-bold text-blue-600 transition hover:bg-blue-600 hover:text-white"
          >
            洽談 B2B 合作
          </a>
        </div>
      </div>
    </section>
  );
}
