import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";

export const metadata: Metadata = {
  title: "離線",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <PageShell>
      <section className="flex min-h-[60vh] items-center justify-center px-4 py-16">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-700 text-xl font-bold text-white">
            VCG
          </div>
          <h1 className="text-xl font-bold text-slate-900">目前離線</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            無法連接網絡。請檢查 Wi‑Fi 或流動數據後再試。
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700"
          >
            返回首頁
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
