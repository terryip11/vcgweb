import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { getAllBlogSlugs } from "@/lib/supabase/blog-queries";

const PUBLIC_ROUTES = [
  "",
  "/compare",
  "/sme",
  "/funds",
  "/calculator",
  "/partner",
  "/partner/terms",
  "/lenders",
  "/privacy",
  "/disclaimer",
  "/blog",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const lastModified = new Date();
  const blogSlugs = await getAllBlogSlugs();

  const staticEntries = PUBLIC_ROUTES.map((path) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: (path === "" || path === "/blog"
      ? "weekly"
      : "monthly") as MetadataRoute.Sitemap[number]["changeFrequency"],
    priority: path === "" ? 1 : path === "/blog" ? 0.9 : 0.8,
  }));

  const blogEntries = blogSlugs.map((slug) => ({
    url: `${base}/blog/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...blogEntries];
}
