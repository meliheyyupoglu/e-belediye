"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Basvuru } from "@/lib/db";

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
      setError("Bağlantı hatası");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-primary">Başvuru Sorgula</h1>

      <div className="mb-6 flex max-w-md gap-3">
        <input
          type="number"
          min={1}
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="form-input"
          placeholder="Başvuru Numarası"
        />
        <button
          onClick={() => sorgula()}
          className="btn-primary whitespace-nowrap"
          disabled={loading}
        >
          {loading ? "..." : "Sorgula"}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
          {error}
        </div>
      )}

      {basvuru && (
        <div className="info-card max-w-2xl">
          <h2 className="mb-3 text-lg font-semibold">
            Başvuru No: {basvuru.id}
          </h2>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="font-medium">Ad Soyad</dt>
              <dd>{basvuru.ad_soyad}</dd>
            </div>
            <div>
              <dt className="font-medium">Müdürlük</dt>
              <dd>{basvuru.departman}</dd>
            </div>
            <div>
              <dt className="font-medium">Konu</dt>
              <dd>{basvuru.konu}</dd>
            </div>
            <div>
              <dt className="font-medium">Detay</dt>
              <dd>{basvuru.detay}</dd>
            </div>
            <div>
              <dt className="font-medium">Durum</dt>
              <dd>{basvuru.durum}</dd>
            </div>
            <div>
              <dt className="font-medium">Tarih</dt>
              <dd>{basvuru.tarih}</dd>
            </div>
            {basvuru.notlar && (
              <div>
                <dt className="font-medium">Yetkili Notu</dt>
                <dd>{basvuru.notlar}</dd>
              </div>
            )}
            {basvuru.belge_dosya && (
              <div>
                <dt className="font-medium">Ek Belge</dt>
                <dd>{basvuru.belge_dosya}</dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </div>
  );
}
