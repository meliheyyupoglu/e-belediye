"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import MapLocationView from "@/components/MapLocationView";
import type { Basvuru } from "@/lib/db";
import { getHaritaSikayetById } from "@/lib/harita";

const DURUM_COLORS: Record<string, string> = {
  "İncelemede": "bg-yellow-100 text-yellow-800",
  "Devam Ediyor": "bg-blue-100 text-blue-800",
  "Çözüldü": "bg-green-100 text-green-800",
  "Reddedildi": "bg-red-100 text-red-800",
};

export default function SorgulaPage() {
  const searchParams = useSearchParams();
  const [id, setId] = useState(searchParams.get("id") || "");
  const [basvuru, setBasvuru] = useState<Basvuru | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const qId = searchParams.get("id");
    if (qId) {
      setId(qId);
      sorgula(qId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  async function sorgula(basvuruId?: string) {
    const targetId = basvuruId || id;
    if (!targetId) return;
    setLoading(true);
    setError("");
    setBasvuru(null);
    try {
      const res = await fetch(`/api/basvurular/${targetId}`);
      if (!res.ok) {
        setError("Bu numaraya ait başvuru bulunamadı.");
        return;
      }
      setBasvuru(await res.json());
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="site-container pt-8">
        <PageHeader
          title="Başvuru Sorgula"
          subtitle="Başvuru numaranız ile sürecinizi anlık olarak takip edebilirsiniz."
          breadcrumbs={[{ label: "Başvuru Sorgula" }]}
        />
      </div>

      <section className="content-section pt-0">
        <div className="max-w-2xl">
          <div className="info-card mb-6">
            <label className="form-label">Başvuru Numarası</label>
            <div className="flex gap-3">
              <input
                type="number"
                min={1}
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="form-input"
                placeholder="Örn: 1"
                onKeyDown={(e) => e.key === "Enter" && sorgula()}
              />
              <button onClick={() => sorgula()} className="btn-primary whitespace-nowrap px-6" disabled={loading}>
                {loading ? "..." : "Sorgula"}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-800 text-sm mb-4">
              {error}
            </div>
          )}

          {basvuru && (
            <div className="info-card animate-fade-in">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-lg font-bold">Başvuru #{basvuru.id}</h2>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${DURUM_COLORS[basvuru.durum] || "bg-gray-100"}`}>
                  {basvuru.durum}
                </span>
              </div>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {[
                  ["Ad Soyad", basvuru.ad_soyad],
                  ["Müdürlük", basvuru.departman],
                  ["Konu", basvuru.konu],
                  ["Tarih", basvuru.tarih],
                ].map(([label, value]) => (
                  <div key={label as string}>
                    <dt className="text-gray-400 text-xs mb-0.5">{label}</dt>
                    <dd className="font-medium text-gray-800">{value}</dd>
                  </div>
                ))}
                {basvuru.basvuru_tipi && (
                  <div>
                    <dt className="text-gray-400 text-xs mb-0.5">Şikayet Tipi</dt>
                    <dd className="font-medium text-gray-800">
                      {getHaritaSikayetById(basvuru.basvuru_tipi)?.label || basvuru.basvuru_tipi}
                    </dd>
                  </div>
                )}
                {basvuru.cadde_sokak && (
                  <div className="sm:col-span-2">
                    <dt className="text-gray-400 text-xs mb-0.5">Cadde / Sokak</dt>
                    <dd className="font-medium text-gray-800">{basvuru.cadde_sokak}</dd>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <dt className="text-gray-400 text-xs mb-0.5">Detay</dt>
                  <dd className="text-gray-700">{basvuru.detay}</dd>
                </div>
                {basvuru.lat != null && basvuru.lng != null && (
                  <div className="sm:col-span-2">
                    <MapLocationView lat={basvuru.lat} lng={basvuru.lng} adres={basvuru.adres} />
                  </div>
                )}
                {basvuru.notlar && (
                  <div className="sm:col-span-2 rounded-lg bg-blue-50 p-3">
                    <dt className="text-primary text-xs font-medium mb-0.5">Yetkili Notu</dt>
                    <dd className="text-gray-700">{basvuru.notlar}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
