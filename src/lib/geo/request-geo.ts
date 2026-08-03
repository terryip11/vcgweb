/** 從 CDN / 反向代理 headers 解析訪客國家（ISO 3166-1 alpha-2） */
export function getCountryCode(request: Request): string | null {
  const cf = request.headers.get("cf-ipcountry");
  if (cf && cf !== "XX" && cf !== "T1") {
    return cf.toUpperCase();
  }

  const vercel = request.headers.get("x-vercel-ip-country");
  if (vercel) return vercel.toUpperCase();

  return null;
}

/** 推廣統計是否計入「香港本地流量」 */
export function isHongKongTraffic(request: Request): boolean {
  const code = getCountryCode(request);
  if (code === "HK") return true;

  // 本地開發或未經 CDN 時無 country header
  if (!code) {
    return (
      process.env.NODE_ENV === "development" ||
      process.env.AFFILIATE_GEO_UNKNOWN_AS_HK === "true"
    );
  }

  return false;
}
