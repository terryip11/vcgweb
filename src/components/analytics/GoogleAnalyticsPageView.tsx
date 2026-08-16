"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { getGaMeasurementId } from "@/lib/analytics/ga4";

export default function GoogleAnalyticsPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const gaId = getGaMeasurementId();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!gaId) return;

    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const send = () => {
      if (cancelled || !window.gtag) return false;
      window.gtag("config", gaId, { page_path: pagePath });
      return true;
    };

    if (send()) return;

    const timer = window.setInterval(() => {
      attempts += 1;
      if (send() || attempts >= 20) {
        window.clearInterval(timer);
      }
    }, 100);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [pathname, searchParams, gaId]);

  return null;
}
