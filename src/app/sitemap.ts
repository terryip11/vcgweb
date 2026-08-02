import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

const PUBLIC_ROUTES = [
  "",
  "/compare",
  "/sme",
  "/funds",
  "/owner",
  "/calculator",
  "/partner",
  "/partner/terms",
  "/lenders",
  "/login",
  "/privacy",
  "/disclaimer",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const lastModified = new Date();

  return PUBLIC_ROUTES.map((path) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
