import Link from "next/link";

export default function LeadsPagination({
  page,
  pageSize,
  total,
  basePath,
  searchParams,
}: {
  page: number;
  pageSize: number;
  total: number;
  basePath: string;
  searchParams: Record<string, string | undefined>;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (totalPages <= 1) return null;

  function hrefFor(nextPage: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value) params.set(key, value);
    }
    params.set("page", String(nextPage));
    return `${basePath}?${params.toString()}`;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm">
      <p className="text-slate-500">
        第 {page} / {totalPages} 頁 · 共 {total} 筆
      </p>
      <div className="flex gap-2">
        {page > 1 && (
          <Link
            href={hrefFor(page - 1)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
          >
            上一頁
          </Link>
        )}
        {page < totalPages && (
          <Link
            href={hrefFor(page + 1)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
          >
            下一頁
          </Link>
        )}
      </div>
    </div>
  );
}
