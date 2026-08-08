import Link from "next/link";
import { BELEDIYE_ADI, NAV_ITEMS } from "@/lib/constants";
import { BELEDIYE_ILETISIM } from "@/lib/mudurlukler";

export default function Footer() {
  return (
    <footer id="iletisim" className="mt-auto bg-gray-900 text-gray-300">
      <div className="site-container py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-3">{BELEDIYE_ADI}</h3>
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
            <li>
              <Link href="/yonetici" className="hover:text-white transition text-gray-500">
                Personel / Yönetici Girişi
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">İletişim</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>{BELEDIYE_ILETISIM.adres}</li>
            <li>
              <a href={`tel:${BELEDIYE_ILETISIM.telefon.replace(/\s/g, "")}`} className="hover:text-white">
                Tel: {BELEDIYE_ILETISIM.telefon}
              </a>
            </li>
            <li>Santral: {BELEDIYE_ILETISIM.telefon_santral}</li>
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
