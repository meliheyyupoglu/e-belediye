"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BELEDIYE_ADI,
  BELEDIYE_SLOGAN,
  NAV_ITEMS,
} from "@/lib/constants";
import { BELEDIYE_ILETISIM } from "@/lib/mudurlukler";
import SearchModal from "@/components/SearchModal";

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50">
      {/* Üst bilgi çubuğu */}
      <div className="bg-primary-dark text-xs text-blue-100">
        <div className="site-container flex items-center justify-between py-2">
          <span className="hidden sm:inline">{BELEDIYE_SLOGAN}</span>
          <div className="flex items-center gap-4 ml-auto">
            <a
              href={`tel:${BELEDIYE_ILETISIM.telefon.replace(/\s/g, "")}`}
              className="hover:text-white transition"
            >
              {BELEDIYE_ILETISIM.telefon}
            </a>
            <span className="hidden md:inline text-blue-300">|</span>
            <span className="hidden md:inline truncate max-w-xs">
              {BELEDIYE_ILETISIM.adres}
            </span>
          </div>
        </div>
      </div>

      {/* Ana navigasyon */}
      <div
        className={`border-b bg-white transition-shadow ${
          scrolled ? "shadow-md border-gray-200" : "border-transparent"
        }`}
      >
        <div className="site-container flex items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-white font-bold text-lg shadow-sm group-hover:bg-primary-dark transition">
              DB
            </div>
            <div>
              <p className="font-bold text-gray-900 leading-tight text-sm md:text-base">
                {BELEDIYE_ADI}
              </p>
              <p className="text-xs text-gray-500 hidden sm:block">
                e-Belediye Portalı
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            <nav className="flex items-center gap-0.5">
              {NAV_ITEMS.filter((i) => !["Başvuru Yap", "Başvuru Sorgula"].includes(i.label)).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link text-xs xl:text-sm ${isActive(item.href) ? "nav-link-active" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <SearchModal />
            <Link href="/sorgula" className="btn-secondary ml-1 text-xs xl:text-sm px-3 py-2">
              Sorgula
            </Link>
            <Link href="/basvuru" className="btn-primary ml-1 text-xs xl:text-sm px-3 py-2">
              Başvuru Yap
            </Link>
          </div>

          {/* Mobile: search + menu */}
          <div className="flex lg:hidden items-center gap-1">
            <SearchModal />
            <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menü"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="lg:hidden border-t bg-white px-4 py-3 space-y-1 animate-fade-in">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive(item.href)
                    ? "bg-blue-50 text-primary"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/basvuru" className="btn-primary w-full mt-2 text-center">
              Hemen Başvur
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
