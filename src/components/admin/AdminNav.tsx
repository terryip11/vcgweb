import Link from "next/link";

const NAV_ITEMS = [
  { href: "/admin", label: "概覽", icon: "📊" },
  { href: "/admin/leads", label: "客戶查詢", icon: "📋" },
  { href: "/admin/products", label: "貸款產品", icon: "💳" },
  { href: "/admin/campaigns", label: "行銷活動", icon: "📢" },
  { href: "/admin/members", label: "會員", icon: "👤" },
  { href: "/admin/affiliates", label: "推廣夥伴", icon: "🤝" },
  { href: "/admin/analytics", label: "點擊分析", icon: "📈" },
];

export default function AdminNav({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <nav className="space-y-1">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
            isActive(item.href)
              ? "bg-blue-600 text-white"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <span aria-hidden>{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
