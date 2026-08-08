import Link from "next/link";
import PageHeader from "@/components/PageHeader";

export default function EDevletPage() {
  return (
    <>
      <div className="site-container pt-8">
        <PageHeader
          title="e-Devlet Entegrasyonu"
          subtitle="Dijital devlet kapısı üzerinden belediye hizmetlerine erişim."
          breadcrumbs={[{ label: "e-Devlet" }]}
        />
      </div>
      <section className="content-section pt-0">
        <div className="max-w-2xl mx-auto">
          <div className="info-card text-center space-y-5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-primary">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Yakında Hizmetinizde</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Dörtyol Belediyesi e-Devlet entegrasyonu üzerinde çalışılmaktadır.
              e-Devlet kapısı aracılığıyla belediye hizmetlerine doğrudan erişim
              sağlanması planlanmaktadır. Bu süreçte talep ve şikayetlerinizi
              online başvuru formumuz üzerinden iletebilirsiniz.
            </p>
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              e-Devlet bağlantısı henüz aktif değildir. Güncellemeler duyurular
              bölümünden paylaşılacaktır.
            </div>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link href="/basvuru" className="btn-primary px-6 py-3">
                Online Başvuru Yap
              </Link>
              <Link href="/sorgula" className="btn-secondary px-6 py-3">
                Başvuru Sorgula
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
