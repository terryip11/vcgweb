"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";
import { createClient } from "@/lib/supabase/client";

function SidebarPanel({
  pathname,
  userEmail,
  onNavigate,
  onSignOut,
}: {
  pathname: string;
  userEmail?: string;
  onNavigate?: () => void;
  onSignOut: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-100 px-5 py-5">
        <Link
          href="/admin"
          onClick={onNavigate}
          className="flex items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
            VCG
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">管理後台</p>
            <p className="text-xs text-slate-400">Admin Console</p>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        <AdminNav pathname={pathname} onNavigate={onNavigate} />
      </div>

      <div className="border-t border-slate-100 px-4 py-4">
        <p className="truncate text-xs text-slate-500">{userEmail}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Link
            href="/"
            onClick={onNavigate}
            className="rounded-lg px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100"
          >
            返回網站
          </Link>
          <button
            type="button"
            onClick={() => {
              onNavigate?.();
              void onSignOut();
            }}
            className="rounded-lg px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100"
          >
            登出
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  async function signOut() {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white lg:block">
        <SidebarPanel
          pathname={pathname}
          userEmail={userEmail}
          onSignOut={signOut}
        />
      </aside>

      {/* Mobile drawer backdrop */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="關閉選單"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[min(100vw-3rem,18rem)] border-r border-slate-200 bg-white shadow-xl transition-transform duration-200 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!mobileOpen}
      >
        <SidebarPanel
          pathname={pathname}
          userEmail={userEmail}
          onNavigate={closeMobile}
          onSignOut={signOut}
        />
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
              aria-label="開啟選單"
              aria-expanded={mobileOpen}
            >
              ☰
            </button>
            <Link href="/admin" className="min-w-0 flex-1 truncate text-sm font-bold text-slate-900">
              VCG 管理後台
            </Link>
            <Link
              href="/admin/leads"
              className="shrink-0 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700"
            >
              查詢
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
