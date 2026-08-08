import Link from "next/link";
import { notFound } from "next/navigation";
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
    <div>
      <Link href="/mudurlukler" className="btn-secondary mb-6 inline-block">
        Müdürlükler Listesine Dön
      </Link>

      <div className="mudurluk-detail-header mb-6">
        <h1 className="text-2xl font-bold">{ad}</h1>
        <p className="mt-1 text-blue-100">Müdür: {bilgi.mudur}</p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h2 className="mb-2 font-semibold">İletişim</h2>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>
              <strong>Adres:</strong> {BELEDIYE_ILETISIM.adres}
            </li>
            <li>
              <strong>Telefon:</strong> {BELEDIYE_ILETISIM.telefon}
            </li>
            <li>
              <strong>Santral / Dahili:</strong> {telefon}
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-2 font-semibold">Resmi Kaynak</h2>
          <a
            href={bilgi.kaynak}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary underline"
          >
            dortyol.bel.tr üzerinde görüntüle
          </a>
        </div>
      </div>

      <h2 className="mb-2 text-lg font-semibold">Müdürlük Hakkında</h2>
      <p className="mb-6 leading-relaxed text-gray-600">{bilgi.aciklama}</p>

      {bilgi.gorevler.length > 0 && (
        <>
          <h2 className="mb-2 text-lg font-semibold">
            Görev ve Sorumluluklar
          </h2>
          <ul className="mb-6 list-inside list-disc space-y-1 text-gray-600">
            {bilgi.gorevler.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </>
      )}

      <Link href="/basvuru" className="btn-primary">
        Bu Müdürlüğe Başvuru Yap
      </Link>
    </div>
  );
}
