import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "管理後台 | VCG",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
