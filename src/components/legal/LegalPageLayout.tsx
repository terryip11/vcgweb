import Link from "next/link";
import PageShell from "@/components/layout/PageShell";

export default function LegalPageLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <PageShell>
      <article className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <nav className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-blue-600">
            首頁
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-700">{title}</span>
        </nav>
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">最後更新：{updated}</p>
        <div className="prose-legal mt-8 space-y-4 text-sm leading-relaxed text-slate-700">
          {children}
        </div>
      </article>
    </PageShell>
  );
}
