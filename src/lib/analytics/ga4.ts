/** GA4 Measurement ID，格式 G-XXXXXXXXXX */
export function getGaMeasurementId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  if (!id || !/^G-[A-Z0-9]+$/i.test(id)) return undefined;
  return id;
}

declare global {
  interface Window {
    gtag?: (
      command: "config" | "event" | "js" | "set",
      targetId: string | Date,
      config?: Record<string, unknown>,
    ) => void;
    dataLayer?: unknown[];
  }
}

export function trackGaEvent(
  eventName: string,
  params?: Record<string, unknown>,
): void {
  const gaId = getGaMeasurementId();
  if (!gaId || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", eventName, params);
}
