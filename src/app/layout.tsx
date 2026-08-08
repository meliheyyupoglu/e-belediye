import Sidebar from "@/components/Sidebar";
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
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto p-6 md:p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
