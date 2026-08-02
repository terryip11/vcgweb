import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ReferralCapture from "@/components/affiliate/ReferralCapture";
import PwaInstallPrompt from "@/components/pwa/PwaInstallPrompt";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function PageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ReferralCapture />
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppFloat />
      <PwaInstallPrompt />
    </>
  );
}
