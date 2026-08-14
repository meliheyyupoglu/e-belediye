import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import AppProviders from "@/components/AppProviders";
import { BELEDIYE_ADI, SISTEM_ADI } from "@/lib/constants";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: `${BELEDIYE_ADI} | e-Belediye`,
  description: SISTEM_ADI,
  manifest: "/manifest.json",
  applicationName: "Dörtyol e-Belediye",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "e-Belediye",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  formatDetection: {
    telephone: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0d6efd",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
        <AppProviders>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatWidget />
        </AppProviders>
      </body>
    </html>
  );
}
