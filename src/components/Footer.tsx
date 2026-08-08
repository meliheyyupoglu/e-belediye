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
      <div className="site-container py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

      <div className="border-t border-gray-800">
        <div className="site-container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <span>&copy; 2026 {BELEDIYE_ADI}. Tüm hakları saklıdır.</span>
          <span>e-Belediye Vatandaş Başvuru ve Yönetim Sistemi</span>
        </div>
      </div>
    </footer>
  );
}
