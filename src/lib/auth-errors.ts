export function translateAuthError(message: string): string {
  if (message.includes("provider is not enabled")) {
    return "Google 登入尚未在 Supabase 啟用，請到 Dashboard → Authentication → Providers 開啟。";
  }
  if (message.includes("rate limit")) {
    return "請求過於頻繁，請稍後再試。";
  }
  if (message.includes("Email signups are disabled")) {
    return "電郵登入尚未在 Supabase 啟用。";
  }
  return message;
}
