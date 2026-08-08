import PageHeader from "@/components/PageHeader";
import MudurlukGrid from "@/components/MudurlukGrid";
import { BELEDIYE_ILETISIM } from "@/lib/mudurlukler";

export const dynamic = "force-dynamic";

export default function MudurluklerPage() {
  return (
    <>
      <div className="site-container pt-8">
        <PageHeader
          title="Müdürlüklerimiz"
          subtitle="Belediyemiz bünyesindeki tüm müdürlüklerin görev, iletişim ve detay bilgilerine buradan ulaşabilirsiniz."
          breadcrumbs={[{ label: "Müdürlüklerimiz" }]}
        />
      </div>
      <section className="content-section pt-0">
        <div className="mb-6 flex flex-wrap gap-4 text-sm text-gray-600 bg-white rounded-xl p-4 border border-gray-200">
          <span>
            <strong>Merkez:</strong> {BELEDIYE_ILETISIM.adres}
          </span>
          <span>
            <strong>Telefon:</strong> {BELEDIYE_ILETISIM.telefon}
          </span>
        </div>
        <MudurlukGrid />
      </section>
    </>
  );
}
