"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BELEDIYE_SLOGAN,
  NAV_ITEMS,
} from "@/lib/constants";
import { BELEDIYE_ILETISIM } from "@/lib/mudurlukler";
import SearchModal from "@/components/SearchModal";
import BelediyeLogo from "@/components/BelediyeLogo";

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

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  const navItems = NAV_ITEMS.filter(
    (i) => !["Başvuru Yap", "Başvuru Sorgula"].includes(i.label)
  );

  return (
    <header className="sticky top-0 z-50">
      {/* Üst bilgi çubuğu */}
      <div className="bg-primary-dark text-xs text-blue-100">
        <div className="site-container flex items-center justify-between py-1.5 sm:py-2">
          <span className="hidden sm:inline truncate">{BELEDIYE_SLOGAN}</span>
          <span className="sm:hidden text-[11px] truncate max-w-[140px]">
            Dörtyol Belediyesi
          </span>
          <div className="flex items-center gap-3 ml-auto shrink-0">
            <a
              href={`tel:${BELEDIYE_ILETISIM.telefon.replace(/\s/g, "")}`}
              className="flex items-center gap-1 hover:text-white transition font-medium"
            >
              <svg className="w-3.5 h-3.5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
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
        <div className="site-container flex items-center justify-between py-2.5 sm:py-3">
          <Link href="/" className="group min-w-0">
            <BelediyeLogo className="group-hover:opacity-90 transition" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            <nav className="flex items-center gap-0.5">
              {navItems.map((item) => (
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
              className="p-2.5 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={mobileOpen}
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
      </div>

      {/* Mobile menu overlay + panel */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden animate-fade-in"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <nav
            className="fixed inset-y-0 right-0 z-50 w-[min(100vw-3rem,320px)] bg-white shadow-2xl lg:hidden flex flex-col animate-slide-in-right"
            aria-label="Mobil menü"
          >
            <div className="flex items-center justify-between border-b px-4 py-3">
              <span className="font-semibold text-gray-900">Menü</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Kapat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Hızlı işlemler */}
            <div className="grid grid-cols-2 gap-2 p-4 border-b bg-gray-50">
              <Link
                href="/basvuru"
                className="btn-primary text-sm py-3"
                onClick={() => setMobileOpen(false)}
              >
                Başvuru Yap
              </Link>
              <Link
                href="/sorgula"
                className="btn-secondary text-sm py-3"
                onClick={() => setMobileOpen(false)}
              >
                Sorgula
              </Link>
            </div>

            {/* Menü linkleri */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition ${
                    isActive(item.href)
                      ? "bg-blue-50 text-primary"
                      : "text-gray-700 active:bg-gray-50"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="border-t p-4 pb-safe bg-gray-50">
              <a
                href={`tel:${BELEDIYE_ILETISIM.telefon.replace(/\s/g, "")}`}
                className="flex items-center justify-center gap-2 text-sm font-medium text-primary"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {BELEDIYE_ILETISIM.telefon}
              </a>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
