import Link from "next/link";
import { BELEDIYE_ADI, NAV_ITEMS } from "@/lib/constants";
import { BELEDIYE_ILETISIM } from "@/lib/mudurlukler";
import BelediyeLogo from "@/components/BelediyeLogo";
import AbonelikForm from "@/components/AbonelikForm";

const FOOTER_LINKS = {
  hizmetler: [
    { href: "/randevu", label: "Randevu Al" },
    { href: "/basvuru/gecmis", label: "Başvuru Geçmişim" },
    { href: "/basvuru/harita", label: "Harita ile Şikayet" },
    { href: "/odeme", label: "Online Ödeme" },
    { href: "/e-devlet", label: "e-Devlet Giriş" },
  ],
  kurumsal: [
    { href: "/projeler", label: "Projeler" },
    { href: "/etkinlikler", label: "Etkinlikler" },
    { href: "/basin", label: "Basın" },
  ],
  yasal: [
    { href: "/kvkk", label: "KVKK Aydınlatma Metni" },
    { href: "/gizlilik", label: "Gizlilik Politikası" },
    { href: "/kullanim-kosullari", label: "Kullanım Koşulları" },
  ],
};

export default function Footer() {
  return (
    <footer id="iletisim" className="mt-auto bg-gray-900 text-gray-300">
      {/* Mobil hızlı erişim */}
      <div className="sm:hidden border-b border-gray-800">
        <div className="site-container py-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Hızlı Erişim</p>
          <div className="grid grid-cols-4 gap-2">
            <Link href="/basvuru" className="mobile-quick-link">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Başvuru
            </Link>
            <Link href="/sorgula" className="mobile-quick-link">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Sorgula
            </Link>
            <Link href="/randevu" className="mobile-quick-link">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Randevu
            </Link>
            <Link href="/basvuru/harita" className="mobile-quick-link">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Harita
            </Link>
          </div>
        </div>
      </div>

      <div className="site-container py-8 sm:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        <div>
          <BelediyeLogo showText className="[&_p:first-child]:text-white [&_p:last-child]:text-gray-400 mb-3" />
          <p className="text-sm leading-relaxed text-gray-400">
            Vatandaşlarımıza şeffaf, hızlı ve etkin hizmet sunmak için
            dijital belediyecilik anlayışıyla çalışıyoruz.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Hızlı Erişim</h4>
          <ul className="space-y-2 text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white transition">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">e-Hizmetler</h4>
          <ul className="space-y-2 text-sm">
            {FOOTER_LINKS.hizmetler.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white transition">
                  {item.label}
                </Link>
              </li>
            ))}
            {FOOTER_LINKS.kurumsal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white transition">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Yasal & İletişim</h4>
          <ul className="space-y-2 text-sm mb-4">
            {FOOTER_LINKS.yasal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white transition">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/yonetici" className="hover:text-white transition text-gray-500">
                Personel / Yönetici Girişi
              </Link>
            </li>
          </ul>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>{BELEDIYE_ILETISIM.adres}</li>
            <li>
              <a href={`tel:${BELEDIYE_ILETISIM.telefon.replace(/\s/g, "")}`} className="hover:text-white">
                Tel: {BELEDIYE_ILETISIM.telefon}
              </a>
            </li>
            <li>
              <a
                href="https://www.dortyol.bel.tr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-white transition"
              >
                www.dortyol.bel.tr
              </a>
            </li>
          </ul>
          <div className="mt-6 pt-4 border-t border-gray-800">
            <AbonelikForm />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 pb-safe">
        <div className="site-container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500 text-center sm:text-left">
          <span>&copy; 2026 {BELEDIYE_ADI}. Tüm hakları saklıdır.</span>
          <span>e-Belediye Vatandaş Başvuru ve Yönetim Sistemi</span>
        </div>
      </div>
    </footer>
  );
}
