"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import AuthButton from "@/components/auth/AuthButton";

const navLinks = [
  { href: "/compare", label: "私人貸款" },
  { href: "/sme", label: "中小企融資" },
  { href: "/funds", label: "基金申請" },
  { href: "/partner", label: "推廣夥伴" },
  { href: "/calculator", label: "貸款計算機" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 text-sm font-bold text-white">
            VCG
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold leading-tight text-slate-900">
              創健佳商業事務所
            </p>
            <p className="text-xs text-slate-400">香港貸款配對平台</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition hover:text-blue-600 ${
                isActive(link.href)
                  ? "text-blue-600"
                  : "text-slate-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/compare"
            className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-slate-900 transition hover:bg-amber-400"
          >
            立即比較
          </Link>
          <AuthButton />
        </nav>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-600 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="選單"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <nav className="border-t border-slate-100 px-4 py-3 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block py-2.5 text-sm font-medium ${
                isActive(link.href) ? "text-blue-600" : "text-slate-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/compare"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-xl bg-amber-500 py-2.5 text-center text-sm font-bold text-slate-900"
          >
            立即比較
          </Link>
          <div className="mt-3 border-t border-slate-100 pt-3">
            <AuthButton onNavigate={() => setOpen(false)} className="w-full justify-center" />
          </div>
        </nav>
      )}
    </header>
  );
}
