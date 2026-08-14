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
import DarkModeToggle from "@/components/DarkModeToggle";
import NotificationBell from "@/components/NotificationBell";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const overlayMode = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    onScroll();
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

  const navLinkClass = (active: boolean) => {
    if (overlayMode) {
      return active
        ? "px-3 py-2 text-sm font-semibold text-white bg-white/20 rounded-lg"
        : "px-3 py-2 text-sm font-medium text-white/90 rounded-lg hover:text-white hover:bg-white/10 transition";
    }
    return active ? "nav-link nav-link-active" : "nav-link";
  };

  return (
    <>
      <header
        className={`z-50 transition-all duration-300 ${
          overlayMode
            ? "absolute inset-x-0 top-0"
            : "sticky top-0 shadow-sm border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
        }`}
      >
        {/* Üst bilgi çubuğu */}
        <div
          className={`text-xs transition-colors ${
            overlayMode
              ? "bg-black/30 text-white/90 backdrop-blur-sm"
              : "bg-primary-dark text-blue-100"
          }`}
        >
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
              <span className="hidden md:inline opacity-50">|</span>
              <span className="hidden md:inline truncate max-w-xs">
                {BELEDIYE_ILETISIM.adres}
              </span>
            </div>
          </div>
        </div>

        {/* Ana navigasyon */}
        <div className={`transition-colors ${overlayMode ? "bg-transparent" : "bg-white dark:bg-gray-900"}`}>
          <div className="site-container flex items-center justify-between py-2.5 sm:py-3">
            <Link href="/" className="group min-w-0">
              <BelediyeLogo
                className="group-hover:opacity-90 transition"
                variant={overlayMode ? "light" : "dark"}
              />
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              <nav className="flex items-center gap-0.5">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${navLinkClass(isActive(item.href))} text-xs xl:text-sm`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <SearchModal overlay={overlayMode} />
              <DarkModeToggle overlay={overlayMode} />
              <NotificationBell overlay={overlayMode} />
              <Link
                href="/kayit"
                className={
                  overlayMode
                    ? "ml-1 hidden sm:inline-flex items-center rounded-full border border-white/60 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10"
                    : "ml-1 hidden sm:inline-flex items-center rounded-full border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:border-primary hover:text-primary dark:border-gray-600 dark:text-gray-200"
                }
              >
                Kayıt Ol
              </Link>
              <Link
                href="/giris"
                className={
                  overlayMode
                    ? "ml-1 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary shadow-md transition hover:bg-blue-50"
                    : "ml-1 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-primary hover:text-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                }
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Giriş Yap
              </Link>
            </div>

            {/* Mobile */}
            <div className="flex lg:hidden items-center gap-0.5">
              <DarkModeToggle overlay={overlayMode} />
              <NotificationBell overlay={overlayMode} />
              <Link
                href="/giris"
                className={`rounded-full p-2.5 transition ${
                  overlayMode ? "text-white hover:bg-white/10" : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
                aria-label="Giriş Yap"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
              <SearchModal overlay={overlayMode} />
              <button
                className={`p-2.5 rounded-lg transition ${
                  overlayMode ? "text-white hover:bg-white/10" : "hover:bg-gray-100 active:bg-gray-200"
                }`}
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

        {/* Mobile menu */}
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden animate-fade-in"
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
            <nav
              className="fixed inset-y-0 right-0 z-50 w-[min(100vw-3rem,320px)] bg-white dark:bg-gray-900 shadow-2xl lg:hidden flex flex-col animate-slide-in-right"
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

              <div className="grid grid-cols-2 gap-2 p-4 border-b bg-gray-50">
                <Link href="/kayit" className="btn-secondary text-sm py-3" onClick={() => setMobileOpen(false)}>
                  Kayıt Ol
                </Link>
                <Link href="/giris" className="btn-primary text-sm py-3" onClick={() => setMobileOpen(false)}>
                  Giriş Yap
                </Link>
              </div>

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

              <div className="grid grid-cols-2 gap-2 p-4 border-b bg-gray-50 dark:bg-gray-800">
                <Link href="/basvuru" className="btn-primary text-sm py-3" onClick={() => setMobileOpen(false)}>
                  Başvuru
                </Link>
                <Link href="/sorgula" className="btn-secondary text-sm py-3" onClick={() => setMobileOpen(false)}>
                  Sorgula
                </Link>
              </div>

              <div className="border-t p-4 pb-safe bg-gray-50">
                <a
                  href={`tel:${BELEDIYE_ILETISIM.telefon.replace(/\s/g, "")}`}
                  className="flex items-center justify-center gap-2 text-sm font-medium text-primary"
                >
                  {BELEDIYE_ILETISIM.telefon}
                </a>
              </div>
            </nav>
          </>
        )}
      </header>
    </>
  );
}
