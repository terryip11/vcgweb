import Link from "next/link";

const NAV_ITEMS = [
  { href: "/admin", label: "概覽", icon: "📊", badgeKey: null },
  { href: "/admin/leads", label: "客戶查詢", icon: "📋", badgeKey: null },
  { href: "/admin/products", label: "貸款產品", icon: "💳", badgeKey: null },
  { href: "/admin/campaigns", label: "行銷活動", icon: "📢", badgeKey: null },
  { href: "/admin/members", label: "會員", icon: "👤", badgeKey: null },
  {
    href: "/admin/affiliates",
    label: "推廣夥伴",
    icon: "🤝",
    badgeKey: "affiliates" as const,
  },
  { href: "/admin/analytics", label: "點擊分析", icon: "📈", badgeKey: null },
];

export default function AdminNav({
  pathname,
  onNavigate,
  pendingAffiliateCount = 0,
}: {
  pathname: string;
  onNavigate?: () => void;
  pendingAffiliateCount?: number;
}) {
  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <nav className="space-y-1">
      {NAV_ITEMS.map((item) => {
        const badge =
          item.badgeKey === "affiliates" && pendingAffiliateCount > 0
            ? pendingAffiliateCount
            : 0;

        return (
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
            <span className="flex-1">{item.label}</span>
            {badge > 0 && (
              <span
                className={`min-w-[1.25rem] rounded-full px-1.5 py-0.5 text-center text-[10px] font-bold ${
                  isActive(item.href)
                    ? "bg-white text-amber-600"
                    : "bg-amber-500 text-white"
                }`}
              >
                {badge > 99 ? "99+" : badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
