import Link from "next/link";

export default function AdminPendingAffiliateBanner({
  pendingCount,
}: {
  pendingCount: number;
}) {
  if (pendingCount <= 0) return null;

  return (
    <div
      role="alert"
      className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-5 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500 text-lg text-white">
          !
        </span>
        <div>
          <p className="font-bold text-amber-900">
            您有 {pendingCount} 個推廣夥伴申請待審核
          </p>
          <p className="mt-1 text-sm text-amber-800">
            請盡快審核申請、設定 ref 代碼並批准，系統會自動電郵通知申請人。
          </p>
        </div>
      </div>
      <Link
        href="/admin/affiliates?status=pending"
        className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-700"
      >
        立即審核
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
