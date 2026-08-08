import Link from "next/link";
import AnnouncementsSection from "@/components/AnnouncementsSection";
import ServicesGrid from "@/components/ServicesGrid";
import StatsSection from "@/components/StatsSection";
import { BELEDIYE_ADI, BELEDIYE_SLOGAN, SISTEM_ADI, DEPARTMANLAR } from "@/lib/constants";
import { MUDURLUK_BILGILERI } from "@/lib/mudurlukler";
import { MUDURLUK_TO_SLUG } from "@/lib/slug";

export default function AnaSayfa() {
  const oneCikanMudurlukler = DEPARTMANLAR.slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="hero-section">
        <div className="site-container relative py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-blue-200">
              {BELEDIYE_SLOGAN}
            </p>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              {BELEDIYE_ADI}
            </h1>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              {SISTEM_ADI}. Talep, öneri ve şikayetlerinizi online iletin,
              başvurunuzu anlık takip edin.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/basvuru" className="btn-primary text-base px-6 py-3">
                Başvuru Yap
              </Link>
              <Link href="/sorgula" className="btn-outline-white text-base px-6 py-3">
                Başvuru Sorgula
              </Link>
              <Link href="/mudurlukler" className="btn-outline-white text-base px-6 py-3">
                Müdürlüklerimiz
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* İstatistikler */}
      <section className="content-section -mt-8 relative z-10">
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
      <section className="content-section pb-16">
        <div className="cta-section">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Size Nasıl Yardımcı Olabiliriz?
          </h2>
          <p className="text-blue-100 mb-6 max-w-lg mx-auto">
            Belediyemize ulaşmak için online başvuru formunu doldurabilir veya
            444 7 712 numaralı hattımızı arayabilirsiniz.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/basvuru" className="bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition shadow">
              Online Başvuru
            </Link>
            <a href="tel:4447712" className="btn-outline-white px-6 py-3">
              444 7 712
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
