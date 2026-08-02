"use client";

const NAV_ITEMS = [
  { id: "schemes", label: "政府基金" },
  { id: "process", label: "申請流程" },
  { id: "quiz", label: "資格問卷" },
  { id: "contact", label: "VCG 協助" },
] as const;

export default function FundPageNav() {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav
      aria-label="基金申請頁面導航"
      className="sticky top-[57px] z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80"
    >
      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => scrollTo(item.id)}
            className="shrink-0 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-violet-600"
          >
            {item.label}
          </button>
        ))}
        <a
          href="https://wa.me/85264754756?text=你好，我想查詢政府基金申請"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto shrink-0 rounded-lg bg-violet-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-violet-700"
        >
          立即諮詢
        </a>
      </div>
    </nav>
  );
}
