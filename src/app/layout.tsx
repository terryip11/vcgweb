import type { Metadata, Viewport } from "next";
import { Noto_Sans_TC } from "next/font/google";
import { Suspense } from "react";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import GoogleAnalyticsPageView from "@/components/analytics/GoogleAnalyticsPageView";
import PwaRegister from "@/components/pwa/PwaRegister";
import SiteJsonLd from "@/components/seo/SiteJsonLd";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const siteName = "VCG";
const defaultTitle = `私人貸款與中小企融資專家 | ${siteName}`;
const defaultDescription =
  "VCG 香港貸款配對平台 — 比較私人貸款、稅季貸款、中小企融資、政府基金申請及業主貸款。經本網申請享獨家配對及專人跟進，24 小時極速回覆。";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  keywords: [
    "私人貸款",
    "P Loan",
    "中小企融資",
    "業主貸款",
    "稅季貸款",
    "政府基金",
    "ESS",
    "香港貸款比較",
    "VCG",
  ],
  openGraph: {
    type: "website",
    locale: "zh_HK",
    siteName,
    title: defaultTitle,
    description: defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "VCG",
  },
  formatDetection: {
    telephone: true,
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#1d4ed8",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-HK" className={`${notoSansTC.variable} scroll-smooth`}>
      <body className="min-h-screen bg-white font-sans text-slate-800 antialiased">
        <SiteJsonLd />
        <GoogleAnalytics />
        <Suspense fallback={null}>
          <GoogleAnalyticsPageView />
        </Suspense>
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
