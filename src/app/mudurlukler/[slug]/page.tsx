import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import {
  BELEDIYE_ILETISIM,
  MUDURLUK_BILGILERI,
} from "@/lib/mudurlukler";
import { SLUG_TO_MUDURLUK } from "@/lib/slug";

export const dynamic = "force-dynamic";

export default function MudurlukDetayPage({
  params,
}: {
  params: { slug: string };
}) {
  const ad = SLUG_TO_MUDURLUK[params.slug];
  if (!ad) notFound();

  const bilgi = MUDURLUK_BILGILERI[ad];
  if (!bilgi) notFound();

  const telefon = bilgi.telefon_dahili
    ? `${BELEDIYE_ILETISIM.telefon_santral} / ${bilgi.telefon_dahili}`
    : BELEDIYE_ILETISIM.telefon_santral;

  return (
    <>
      <div className="site-container pt-8">
        <PageHeader
          title={ad}
          subtitle={`Müdür: ${bilgi.mudur}`}
          breadcrumbs={[
            { label: "Müdürlüklerimiz", href: "/mudurlukler" },
            { label: ad },
          ]}
        />
      </div>

      <section className="content-section pt-0 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="info-card">
            <h2 className="font-semibold mb-3 text-primary">İletişim</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><strong>Adres:</strong> {BELEDIYE_ILETISIM.adres}</li>
              <li><strong>Telefon:</strong> {BELEDIYE_ILETISIM.telefon}</li>
              <li><strong>Santral / Dahili:</strong> {telefon}</li>
            </ul>
          </div>
          <div className="info-card">
            <h2 className="font-semibold mb-3 text-primary">Resmi Kaynak</h2>
            <a
              href={bilgi.kaynak}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary underline hover:no-underline"
            >
              dortyol.bel.tr üzerinde görüntüle →
            </a>
          </div>
        </div>

        <div className="info-card">
          <h2 className="font-semibold mb-3 text-primary">Müdürlük Hakkında</h2>
          <p className="leading-relaxed text-gray-600">{bilgi.aciklama}</p>
        </div>

        {bilgi.gorevler.length > 0 && (
          <div className="info-card">
            <h2 className="font-semibold mb-3 text-primary">Görev ve Sorumluluklar</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {bilgi.gorevler.map((g) => (
                <li key={g} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {g}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link href="/basvuru" className="btn-primary">
          Bu Müdürlüğe Başvuru Yap
        </Link>
      </section>
    </>
  );
}
