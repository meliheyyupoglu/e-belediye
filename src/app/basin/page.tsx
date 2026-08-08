import PageHeader from "@/components/PageHeader";
import IcerikList from "@/components/IcerikList";
import { fetchIcerikFromApi } from "@/lib/icerik-fetch";

export const dynamic = "force-dynamic";

export default async function BasinPage() {
  const basin = await fetchIcerikFromApi("basin");

  return (
    <>
      <div className="site-container pt-8">
        <PageHeader
          title="Basın & Duyurular"
          subtitle="Belediyemizden basın bültenleri ve resmi açıklamalar."
          breadcrumbs={[{ label: "Basın" }]}
        />
      </div>
      <section className="content-section pt-0">
        <IcerikList
          items={basin}
          emptyMessage="Henüz listelenecek basın içeriği bulunmuyor."
        />
      </section>
    </>
  );
}
