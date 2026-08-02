import Link from "next/link";

export default function AdminUnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl">
          🔒
        </div>
        <h1 className="text-xl font-bold text-slate-900">無管理員權限</h1>
        <p className="mt-2 text-sm text-slate-500">
          此帳戶無法存取管理後台。如需權限，請聯絡 VCG 管理員。
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/member"
            className="rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700"
          >
            前往會員中心
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-slate-500 hover:text-blue-600"
          >
            返回首頁
          </Link>
        </div>
      </div>
    </div>
  );
}
