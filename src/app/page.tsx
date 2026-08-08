import Link from "next/link";
import { BELEDIYE_ADI, SISTEM_ADI } from "@/lib/constants";
import { getStats } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AnaSayfa() {
  const stats = await getStats();

  const kartlar = [
    { key: "toplam", label: "Toplam Başvuru", cls: "primary", value: stats.toplam },
    { key: "incelemede", label: "İncelemede", cls: "warning", value: stats.incelemede },
    { key: "cozuldu", label: "Çözülen Başvuru", cls: "success", value: stats.cozuldu },
    { key: "devam", label: "Devam Eden", cls: "danger", value: stats.devam },
  ];

  return (
    <div>
      <div className="hero-card mb-6">
        <h1 className="text-2xl font-bold">{BELEDIYE_ADI}</h1>
        <p className="mt-1 text-blue-100">{SISTEM_ADI}</p>
      </div>

      <div className="welcome-text mb-8">
        <strong>{BELEDIYE_ADI}</strong> e-Belediye basvuru sistemine hos
        geldiniz. Talep, öneri ve şikayetlerinizi ilgili müdürlüklere buradan
        iletebilir, başvuru numaranız ile sürecinizi takip edebilirsiniz.
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kartlar.map((k) => (
          <div key={k.key} className={`stat-card ${k.cls}`}>
            <div className="text-3xl font-bold text-gray-900">{k.value}</div>
            <div className="text-sm text-gray-500">{k.label}</div>
          </div>
        ))}
      </div>

      <h2 className="mb-4 text-lg font-semibold">Hızlı İşlemler</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Link href="/basvuru" className="btn-primary text-center">
          Yeni Başvuru Yap
        </Link>
        <Link href="/sorgula" className="btn-secondary text-center">
          Başvuru Sorgula
        </Link>
        <Link href="/mudurlukler" className="btn-secondary text-center">
          Müdürlüklerimiz
        </Link>
      </div>
    </div>
  );
}
