import Link from "next/link";

export default function CompareCta() {
  return (
    <section className="border-y border-slate-100 bg-white py-14">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          比較全港私人及商業貸款
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-500">
          一次過比較 APR、最高貸款額及還款期，經 VCG 申請享獨家配對及專人跟進。
        </p>
        <Link
          href="/compare"
          className="mt-6 inline-flex rounded-xl bg-amber-500 px-8 py-3.5 text-sm font-bold text-slate-900 transition hover:bg-amber-400"
        >
          立即比較貸款 →
        </Link>
      </div>
    </section>
  );
}
