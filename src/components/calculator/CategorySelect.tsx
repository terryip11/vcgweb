import {
  OTHER_CATEGORY,
  REVOLVING_CATEGORY_OPTIONS,
  TERM_LOAN_CATEGORIES,
} from "@/data/loan-categories";

interface CategorySelectProps {
  variant: "term" | "revolving";
  category: string;
  categoryOther?: string;
  customRate?: number;
  onChange: (
    category: string,
    categoryOther?: string,
    customRate?: number,
  ) => void;
}

export default function CategorySelect({
  variant,
  category,
  categoryOther = "",
  customRate,
  onChange,
}: CategorySelectProps) {
  if (variant === "term") {
    const allTerm = [...TERM_LOAN_CATEGORIES];
    const selectValue = (allTerm as readonly string[]).includes(category)
      ? category
      : category === OTHER_CATEGORY || categoryOther
        ? OTHER_CATEGORY
        : category || "";

    return (
      <div className="space-y-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-500">
            類別
          </span>
          <select
            value={selectValue}
            onChange={(e) => {
              const v = e.target.value;
              if (v === OTHER_CATEGORY) {
                onChange(OTHER_CATEGORY, categoryOther);
              } else {
                onChange(v, "");
              }
            }}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">請選擇…</option>
            {TERM_LOAN_CATEGORIES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
            <option value={OTHER_CATEGORY}>{OTHER_CATEGORY}</option>
          </select>
        </label>

        {selectValue === OTHER_CATEGORY && (
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">
              請輸入類別
            </span>
            <input
              type="text"
              value={categoryOther}
              onChange={(e) => onChange(OTHER_CATEGORY, e.target.value)}
              placeholder="例如：裝修貸款"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
        )}
      </div>
    );
  }

  const revolvingValues = REVOLVING_CATEGORY_OPTIONS.map((o) => o.value);
  const selectValue = (revolvingValues as string[]).includes(category)
    ? category
    : category === OTHER_CATEGORY
      ? OTHER_CATEGORY
      : category || "";

  return (
    <div className="space-y-2">
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-slate-500">
          類別
        </span>
        <select
          value={selectValue}
          onChange={(e) => {
            const v = e.target.value;
            if (v === OTHER_CATEGORY) {
              onChange(OTHER_CATEGORY, categoryOther, customRate);
            } else {
              onChange(v, "", undefined);
            }
          }}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">請選擇…</option>
          {REVOLVING_CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}（{(opt.rate * 100).toFixed(1)}%）
            </option>
          ))}
          <option value={OTHER_CATEGORY}>{OTHER_CATEGORY}</option>
        </select>
      </label>

      {selectValue === OTHER_CATEGORY && (
        <>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">
              請輸入類別
            </span>
            <input
              type="text"
              value={categoryOther}
              onChange={(e) =>
                onChange(OTHER_CATEGORY, e.target.value, customRate)
              }
              placeholder="例如：私人循環貸款"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">
              月利率 (%)
            </span>
            <input
              type="number"
              min={0}
              step={0.01}
              value={customRate ?? ""}
              onChange={(e) =>
                onChange(
                  OTHER_CATEGORY,
                  categoryOther,
                  Number(e.target.value) || 0,
                )
              }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
        </>
      )}
    </div>
  );
}
