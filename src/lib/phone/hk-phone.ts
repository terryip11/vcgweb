/** 香港本地 8 位號碼（5 / 6 / 9 開首） */
const HK_LOCAL_PATTERN = /^[569]\d{7}$/;

export function normalizeHKPhoneDigits(input: string): string | null {
  const digits = input.replace(/\D/g, "");

  if (digits.length === 8 && HK_LOCAL_PATTERN.test(digits)) {
    return digits;
  }

  if (
    digits.length === 11 &&
    digits.startsWith("852") &&
    HK_LOCAL_PATTERN.test(digits.slice(3))
  ) {
    return digits.slice(3);
  }

  return null;
}

export function isValidHKPhone(input: string): boolean {
  return normalizeHKPhoneDigits(input) !== null;
}

export function formatHKPhoneDisplay(input: string): string {
  const local = normalizeHKPhoneDigits(input);
  if (!local) return input.trim();
  return `${local.slice(0, 4)} ${local.slice(4)}`;
}

/** 儲存至資料庫用（8 位本地號碼） */
export function normalizeHKPhoneForStorage(input: string): string | null {
  return normalizeHKPhoneDigits(input);
}

export const HK_PHONE_HINT =
  "請輸入有效香港電話號碼（8 位，5、6 或 9 開首，例如 91234567）";

export const HK_PHONE_INVALID_MESSAGE =
  "請輸入有效的香港電話號碼（8 位數字，5、6 或 9 開首）";
