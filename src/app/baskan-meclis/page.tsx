import PageHeader from "@/components/PageHeader";
import { BASKAN, BELEDIYE_TARIHCESI, MECLIS_UYE_SAYISI, MECLIS_UYELERI } from "@/lib/baskan";

function partyBadgeClass(parti: string) {
  if (parti === "CHP") return "party-badge party-badge-chp";
  if (parti === "MHP") return "party-badge party-badge-mhp";
  return "party-badge party-badge-bagimsiz";
}

export default function BaskanMeclisPage() {
  return (
    <>
      <div className="site-container pt-6 sm:pt-8">
        <PageHeader
          title="Başkan & Meclis"
          subtitle={`Dörtyol Belediyesi yönetimi ve ${MECLIS_UYE_SAYISI} kişilik belediye meclisi hakkında bilgiler.`}
          breadcrumbs={[{ label: "Başkan & Meclis" }]}
        />
      </div>
      <section className="content-section pt-0 space-y-6 sm:space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-1">
            <div className="info-card text-center">
              <div className="mx-auto mb-3 sm:mb-4 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-primary text-white text-2xl sm:text-3xl font-bold">
                {BASKAN.ad.split(" ").map((n) => n[0]).join("")}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">{BASKAN.ad}</h2>
              <p className="text-sm text-primary font-medium mt-1">{BASKAN.unvan}</p>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div className="info-card">
              <h3 className="font-semibold text-primary mb-2">Başkanın Mesajı</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed italic">&ldquo;{BASKAN.mesaj}&rdquo;</p>
            </div>
            <div className="info-card">
              <h3 className="font-semibold text-primary mb-2">Özgeçmiş</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{BASKAN.ozgecmis}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="section-title mb-1">Belediye Meclisi</h2>
          <p className="text-sm text-gray-500 mb-4">{MECLIS_UYE_SAYISI} meclis üyesi</p>

          {/* Mobil: kart görünümü */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden">
            {MECLIS_UYELERI.map((u) => (
              <div key={u.ad} className="meclis-card flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="meclis-card-name truncate">{u.ad}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{u.gorev}</p>
                </div>
                <span className={partyBadgeClass(u.parti)}>{u.parti}</span>
              </div>
            ))}
          </div>

          {/* Masaüstü: tablo */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {["Ad Soyad", "Parti", "Görev"].map((h) => (
                    <th key={h} className="p-3 text-left font-semibold text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MECLIS_UYELERI.map((u) => (
                  <tr key={u.ad} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium">{u.ad}</td>
                    <td className="p-3 text-gray-500">{u.parti}</td>
                    <td className="p-3">{u.gorev}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="info-card">
          <h3 className="font-semibold text-primary mb-2">Belediye Tarihçesi</h3>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{BELEDIYE_TARIHCESI}</p>
        </div>
      </section>
    </>
  );
}
