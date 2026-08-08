import PageHeader from "@/components/PageHeader";
import IcerikList from "@/components/IcerikList";
import { fetchIcerikFromApi } from "@/lib/icerik-fetch";

export const dynamic = "force-dynamic";

export default async function EtkinliklerPage() {
  const etkinlikler = await fetchIcerikFromApi("etkinlik");

  return (
    <>
      <div className="site-container pt-8">
        <PageHeader
          title="Etkinlikler"
          subtitle="Belediyemizin düzenlediği kültür, sanat ve sosyal etkinlikler."
          breadcrumbs={[{ label: "Etkinlikler" }]}
        />
      </div>
      <section className="content-section pt-0">
        <IcerikList
          items={etkinlikler}
          emptyMessage="Henüz listelenecek etkinlik bulunmuyor."
        />
      </section>
    </>
  );
}
