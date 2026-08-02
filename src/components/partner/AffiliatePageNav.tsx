"use client";

const NAV_ITEMS = [
  { id: "how", label: "如何運作" },
  { id: "commission", label: "佣金模式" },
  { id: "promote", label: "可推廣內容" },
  { id: "apply", label: "立即申請" },
] as const;

export default function AffiliatePageNav() {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav
      aria-label="推廣夥伴頁面導航"
      className="sticky top-[57px] z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => scrollTo(item.id)}
            className="shrink-0 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-teal-600"
          >
            {item.label}
          </button>
        ))}
        <a
          href="https://wa.me/85264754756?text=你好，我想了解 VCG 推廣夥伴計劃"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto shrink-0 rounded-lg bg-teal-600 px-4 py-2 text-sm font-bold text-white hover:bg-teal-700"
        >
          立即諮詢
        </a>
      </div>
    </nav>
  );
}
