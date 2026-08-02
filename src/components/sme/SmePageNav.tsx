"use client";

const NAV_ITEMS = [
  { id: "overview", label: "計劃概覽" },
  { id: "quiz", label: "資格問卷" },
  { id: "alternatives", label: "商業貸款" },
] as const;

export default function SmePageNav() {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav
      aria-label="頁面導航"
      className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80"
    >
      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => scrollTo(item.id)}
            className="shrink-0 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
          >
            {item.label}
          </button>
        ))}
        <a
          href="https://wa.me/85264754756?text=你好，我想查詢政府八成信貸擔保計劃"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
        >
          立即諮詢
        </a>
      </div>
    </nav>
  );
}
