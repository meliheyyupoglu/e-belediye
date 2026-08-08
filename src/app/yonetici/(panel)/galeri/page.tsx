"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import AdminNav from "@/components/AdminNav";
import type { Basvuru } from "@/lib/db";

export default function GaleriPage() {
  const [basvurular, setBasvurular] = useState<Basvuru[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/basvurular")
      .then((r) => r.json())
      .then((data: Basvuru[]) => setBasvurular(data.filter((b) => b.belge_url)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="site-container pt-8">
        <PageHeader
          title="Belge Galerisi"
          subtitle="Başvurulara eklenen görseller ve belgeler."
          breadcrumbs={[
            { label: "Yönetici", href: "/yonetici" },
            { label: "Galeri" },
          ]}
        />
        <div className="mt-4">
          <AdminNav />
        </div>
      </div>
      <section className="content-section pt-0">
        {loading ? (
          <p className="text-gray-500">Yükleniyor...</p>
        ) : basvurular.length === 0 ? (
          <div className="info-card text-center text-gray-500 py-12">
            Görsel içeren başvuru bulunmuyor.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {basvurular.map((b) => (
              <a
                key={b.id}
                href={b.belge_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.belge_url}
                  alt={`Başvuru #${b.id} — ${b.konu}`}
                  className="w-full h-40 object-cover group-hover:opacity-90 transition"
                />
                <div className="p-3">
                  <p className="text-xs text-gray-400">#{b.id} · {b.tarih}</p>
                  <p className="text-sm font-medium truncate">{b.konu}</p>
                  <p className="text-xs text-gray-500 truncate">{b.ad_soyad}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
