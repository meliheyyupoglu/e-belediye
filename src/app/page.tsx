import Link from "next/link";
import AnnouncementsSection from "@/components/AnnouncementsSection";
import HomeHero from "@/components/HomeHero";
import ServicesGrid from "@/components/ServicesGrid";
import StatsSection from "@/components/StatsSection";
import { DEPARTMANLAR } from "@/lib/constants";
import { MUDURLUK_BILGILERI } from "@/lib/mudurlukler";
import { MUDURLUK_TO_SLUG } from "@/lib/slug";

export default function AnaSayfa() {
  const oneCikanMudurlukler = DEPARTMANLAR.slice(0, 4);

  return (
    <>
      <HomeHero />

      {/* İstatistikler */}
      <section className="content-section -mt-6 relative z-10 pt-4">
        <StatsSection />
      </section>

      {/* e-Hizmetler */}
      <section className="content-section pt-4">
        <ServicesGrid />
      </section>

      {/* Duyurular */}
      <section className="content-section bg-white border-y border-gray-200">
        <AnnouncementsSection />
      </section>

      {/* Öne çıkan müdürlükler */}
      <section className="content-section">
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-title">Müdürlüklerimiz</h2>
          <Link href="/mudurlukler" className="text-sm font-medium text-primary hover:underline">
            Tümünü gör →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {oneCikanMudurlukler.map((ad) => {
            const bilgi = MUDURLUK_BILGILERI[ad];
            const slug = MUDURLUK_TO_SLUG[ad];
            return (
              <Link
                key={ad}
                href={`/mudurlukler/${slug}`}
                className="mudurluk-card hover:shadow-md hover:border-primary/30 transition group"
              >
                <h3 className="font-semibold text-primary text-sm mb-1 group-hover:underline">
                  {ad}
                </h3>
                <p className="text-xs text-gray-500 mb-2">Müdür: {bilgi?.mudur}</p>
                <p className="text-xs text-gray-400 line-clamp-2">
                  {bilgi?.aciklama}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="content-section pb-12 sm:pb-16">
        <div className="cta-section">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">
            Size Nasıl Yardımcı Olabiliriz?
          </h2>
          <p className="text-sm sm:text-base text-blue-100 mb-5 sm:mb-6 max-w-lg mx-auto">
            Belediyemize ulaşmak için online başvuru formunu doldurabilir veya
            444 7 712 numaralı hattımızı arayabilirsiniz.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2.5 sm:gap-3">
            <Link href="/basvuru" className="bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition shadow w-full sm:w-auto">
              Online Başvuru
            </Link>
            <a href="tel:4447712" className="btn-outline-white px-6 py-3 w-full sm:w-auto">
              444 7 712
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
