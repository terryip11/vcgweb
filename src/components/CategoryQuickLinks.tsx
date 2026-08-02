import Link from "next/link";

const links = [
  { href: "/compare", label: "私人貸款", icon: "💳" },
  { href: "/compare?category=tax", label: "稅季貸款", icon: "📋" },
  { href: "/sme", label: "中小企融資", icon: "🏢" },
  { href: "/funds", label: "基金申請", icon: "🏛️" },
  { href: "/owner", label: "業主貸款", icon: "🏠" },
  { href: "/calculator", label: "貸款計算機", icon: "🧮" },
  { href: "/partner", label: "推廣夥伴", icon: "🤝" },
];

export default function CategoryQuickLinks() {
  return (
    <section className="border-b border-slate-100 bg-white py-6">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex flex-col items-center gap-2 rounded-xl p-3 text-center transition hover:bg-slate-50"
            >
              <span className="text-2xl">{link.icon}</span>
              <span className="text-xs font-medium text-slate-700 sm:text-sm">
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
