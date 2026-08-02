/** Canonical site origin for links, OG, sitemap, emails. */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;
  return process.env.NODE_ENV === "production"
    ? "https://www.vcgrouphk.com"
    : "http://localhost:3001";
}
