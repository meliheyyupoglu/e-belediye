import Link from "next/link";
import { BELEDIYE_ADI, DEPARTMANLAR } from "@/lib/constants";
import {
  BELEDIYE_ILETISIM,
  MUDURLUK_BILGILERI,
} from "@/lib/mudurlukler";
import { MUDURLUK_TO_SLUG } from "@/lib/slug";

export const dynamic = "force-dynamic";

export default function MudurluklerPage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-primary">Müdürlüklerimiz</h1>

      <div className="welcome-text mb-6">
        <strong>{BELEDIYE_ADI}</strong> bünyesindeki müdürlükler hakkında resmi
        bilgilere buradan ulaşabilirsiniz.
      </div>

      <p className="mb-6 text-sm text-gray-600">
        <strong>Merkez:</strong> {BELEDIYE_ILETISIM.adres} |{" "}
        <strong>Telefon:</strong> {BELEDIYE_ILETISIM.telefon}
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {DEPARTMANLAR.map((ad) => {
          const bilgi = MUDURLUK_BILGILERI[ad];
          const slug = MUDURLUK_TO_SLUG[ad];
          const ozet = bilgi?.aciklama?.slice(0, 140) + "..." || "";

          return (
            <div key={ad} className="mudurluk-card">
              <h3 className="mb-1 font-semibold text-primary">{ad}</h3>
              {bilgi?.mudur && (
                <p className="mb-2 text-sm text-gray-600">
                  <strong>Müdür:</strong> {bilgi.mudur}
                </p>
              )}
              <p className="mb-3 text-sm text-gray-500">{ozet}</p>
              <Link href={`/mudurlukler/${slug}`} className="btn-primary text-sm">
                Detayları Gör
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
