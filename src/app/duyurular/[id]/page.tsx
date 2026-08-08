import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/lib/announcements";
import { duyuruGetir } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function DuyuruDetayPage({ params }: { params: { id: string } }) {
  const duyuru = await duyuruGetir(parseInt(params.id, 10));
  if (!duyuru) notFound();

  return (
    <>
      <div className="site-container pt-8">
        <PageHeader
          title={duyuru.title}
          subtitle={new Date(duyuru.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
          breadcrumbs={[
            { label: "Duyurular", href: "/duyurular" },
            { label: duyuru.title },
          ]}
        />
      </div>
      <section className="content-section pt-0 max-w-3xl">
        <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-4 ${CATEGORY_COLORS[duyuru.category as keyof typeof CATEGORY_COLORS]}`}>
          {CATEGORY_LABELS[duyuru.category as keyof typeof CATEGORY_LABELS]}
        </span>
        <div className="info-card prose prose-sm max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{duyuru.content || duyuru.summary}</p>
        </div>
        {duyuru.href && (
          <Link href={duyuru.href} className="btn-primary mt-4 inline-block">
            İlgili Sayfaya Git
          </Link>
        )}
        <Link href="/duyurular" className="btn-secondary mt-4 ml-3 inline-block">
          ← Tüm Duyurular
        </Link>
      </section>
    </>
  );
}
