import type { BlogFaqItem } from "@/types";

export default function BlogFaqSection({ faq }: { faq: BlogFaqItem[] }) {
  if (!faq.length) return null;

  return (
    <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
      <h2 className="text-xl font-bold text-slate-900">常見問題</h2>
      <p className="mt-1 text-sm text-slate-500">
        以下為本文相關常見問題摘要，僅供參考。
      </p>
      <dl className="mt-6 space-y-5">
        {faq.map((item) => (
          <div key={item.question}>
            <dt className="font-semibold text-slate-900">{item.question}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-slate-600">
              {item.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
