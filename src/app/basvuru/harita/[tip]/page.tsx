import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import HaritaSikayetForm from "@/components/HaritaSikayetForm";
import { getHaritaSikayet } from "@/lib/harita";

export default function HaritaSikayetTipPage({ params }: { params: { tip: string } }) {
  const sikayet = getHaritaSikayet(params.tip);
  if (!sikayet) notFound();

  return (
    <>
      <div className="site-container pt-8">
        <PageHeader
          title={sikayet.label}
          subtitle={sikayet.description}
          breadcrumbs={[
            { label: "Başvuru Yap", href: "/basvuru" },
            { label: "Harita ile Şikayet", href: "/basvuru/harita" },
            { label: sikayet.label },
          ]}
        />
      </div>

      <section className="content-section pt-0">
        <div className="max-w-3xl">
          <div className="mb-5 rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-600">
            <span className="font-medium text-gray-800">İlgili müdürlük:</span> {sikayet.departman}
          </div>
          <HaritaSikayetForm sikayet={sikayet} />
        </div>
      </section>
    </>
  );
}
