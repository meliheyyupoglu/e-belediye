import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { BELEDIYE_ADI, SISTEM_ADI } from "@/lib/constants";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: `${BELEDIYE_ADI} | e-Belediye`,
  description: SISTEM_ADI,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="flex min-h-screen flex-col bg-gray-50">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
