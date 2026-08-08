import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { HARITA_SIKAYETLERI } from "@/lib/harita";

function SikayetIcon({ slug }: { slug: string }) {
  if (slug === "su-kesintisi") {
    return (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3c-1.5 2.5-4 5.5-4 9a4 4 0 008 0c0-3.5-2.5-6.5-4-9z" />
      </svg>
    );
  }
  if (slug === "elektrik") {
    return (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    );
  }
  return (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  );
}

export default function HaritaBasvuruPage() {
  return (
    <>
      <div className="site-container pt-8">
        <PageHeader
          title="Harita ile Şikayet"
          subtitle="Dörtyol haritası üzerinden konum seçerek su, elektrik ve yol şikayetlerinizi iletebilirsiniz."
          breadcrumbs={[
            { label: "Başvuru Yap", href: "/basvuru" },
            { label: "Harita ile Şikayet" },
          ]}
        />
      </div>

      <section className="content-section pt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {HARITA_SIKAYETLERI.map((s) => (
            <Link
              key={s.slug}
              href={`/basvuru/harita/${s.slug}`}
              className={`service-card border-t-4 ${s.color}`}
            >
              <div className={`service-icon ${s.iconBg}`}>
                <SikayetIcon slug={s.slug} />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{s.label}</h3>
              <p className="text-sm text-gray-500 flex-1">{s.description}</p>
              <span className="mt-4 text-sm font-medium text-primary">Haritadan bildir →</span>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-sm text-gray-500 text-center">
          Diğer başvurular için{" "}
          <Link href="/basvuru" className="text-primary font-medium hover:underline">
            genel başvuru formunu
          </Link>{" "}
          kullanabilirsiniz.
        </p>
      </section>
    </>
  );
}
