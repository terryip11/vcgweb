import { ALL_LENDERS, LENDER_GROUPS, OTHER_LENDER } from "@/data/lenders";

interface BankSelectProps {
  label?: string;
  bank: string;
  bankOther?: string;
  onChange: (bank: string, bankOther?: string) => void;
}

export default function BankSelect({
  label = "銀行 / 財務",
  bank,
  bankOther = "",
  onChange,
}: BankSelectProps) {
  const selectValue = ALL_LENDERS.includes(bank)
    ? bank
    : bank === OTHER_LENDER || bankOther
      ? OTHER_LENDER
      : bank || "";

  function handleSelectChange(value: string) {
    if (value === OTHER_LENDER) {
      onChange(OTHER_LENDER, bankOther);
    } else {
      onChange(value, "");
    }
  }

  return (
    <div className="space-y-2">
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-slate-500">
          {label}
        </span>
        <select
          value={selectValue}
          onChange={(e) => handleSelectChange(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">請選擇…</option>
          {LENDER_GROUPS.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.options.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </optgroup>
          ))}
          <option value={OTHER_LENDER}>{OTHER_LENDER}</option>
        </select>
      </label>

      {selectValue === OTHER_LENDER && (
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-500">
            請輸入機構名稱
          </span>
          <input
            type="text"
            value={bankOther}
            onChange={(e) => onChange(OTHER_LENDER, e.target.value)}
            placeholder="例如：XX 財務公司"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>
      )}
    </div>
  );
}
