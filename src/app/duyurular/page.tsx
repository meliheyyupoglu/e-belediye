import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/lib/announcements";
import { tumDuyurulariGetir } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function DuyurularPage() {
  const duyurular = await tumDuyurulariGetir();

  return (
    <>
      <div className="site-container pt-8">
        <PageHeader
          title="Duyurular & Etkinlikler"
          subtitle="Belediyemizden güncel duyuru, etkinlik ve ihale bilgileri."
          breadcrumbs={[{ label: "Duyurular" }]}
        />
      </div>
      <section className="content-section pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {duyurular.map((d) => (
            <article key={d.id} className="announcement-card">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[d.category as keyof typeof CATEGORY_COLORS] || "bg-gray-100"}`}>
                  {CATEGORY_LABELS[d.category as keyof typeof CATEGORY_LABELS] || d.category}
                </span>
                <time className="text-xs text-gray-400">
                  {new Date(d.date).toLocaleDateString("tr-TR")}
                </time>
              </div>
              <h2 className="font-semibold text-gray-900 mb-2">{d.title}</h2>
              <p className="text-sm text-gray-500 line-clamp-3 mb-3">{d.summary}</p>
              <Link href={`/duyurular/${d.id}`} className="text-sm font-medium text-primary hover:underline">
                Devamını oku →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
