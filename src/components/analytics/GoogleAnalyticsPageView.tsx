"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { getGaMeasurementId } from "@/lib/analytics/ga4";

export default function GoogleAnalyticsPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const gaId = getGaMeasurementId();

  useEffect(() => {
    if (!gaId || !window.gtag) return;

    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;

    window.gtag("config", gaId, {
      page_path: pagePath,
    });
  }, [pathname, searchParams, gaId]);

  return null;
}
