import PageHeader from "@/components/PageHeader";
import IcerikList from "@/components/IcerikList";
import { fetchIcerikFromApi } from "@/lib/icerik-fetch";

export const dynamic = "force-dynamic";

export default async function ProjelerPage() {
  const projeler = await fetchIcerikFromApi("proje");

  return (
    <>
      <div className="site-container pt-8">
        <PageHeader
          title="Projelerimiz"
          subtitle="Dörtyol Belediyesi tarafından yürütülen güncel yatırım ve kentsel dönüşüm projeleri."
          breadcrumbs={[{ label: "Projeler" }]}
        />
      </div>
      <section className="content-section pt-0">
        <IcerikList
          items={projeler}
          emptyMessage="Henüz listelenecek proje bulunmuyor."
        />
      </section>
    </>
  );
}
