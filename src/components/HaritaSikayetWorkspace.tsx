"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  HARITA_SIKAYETLERI,
  isInDortyolBounds,
  type HaritaSikayetSlug,
} from "@/lib/harita";
import { saveHaritaBasvuruKonum } from "@/lib/harita-basvuru-storage";
import type { MapLocation } from "@/components/MapPickerInner";

const MapPickerInner = dynamic(() => import("@/components/MapPickerInner"), {
  ssr: false,
  loading: () => <div className="h-full min-h-[360px] bg-gray-100 animate-pulse" />,
});

function SikayetIcon({ slug, className = "w-6 h-6" }: { slug: string; className?: string }) {
  if (slug === "su-kesintisi") {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3c-1.5 2.5-4 5.5-4 9a4 4 0 008 0c0-3.5-2.5-6.5-4-9z" />
      </svg>
    );
  }
  if (slug === "elektrik") {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    );
  }
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  );
}

const CARD_STYLES: Record<string, { ring: string; bg: string; icon: string; desc: string }> = {
  "su-kesintisi": {
    ring: "ring-blue-500",
    bg: "bg-blue-50",
    icon: "text-blue-600",
    desc: "Su kesintisi, altyapı arızası",
  },
  elektrik: {
    ring: "ring-emerald-500",
    bg: "bg-emerald-50",
    icon: "text-emerald-600",
    desc: "Elektrik kesintisi, aydınlatma",
  },
  "bozuk-yol": {
    ring: "ring-amber-500",
    bg: "bg-amber-50",
    icon: "text-amber-600",
    desc: "Çukur, bozuk asfalt, tabela",
  },
};

export default function HaritaSikayetWorkspace() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tipParam = searchParams.get("tip") as HaritaSikayetSlug | null;

  const [selectedSlug, setSelectedSlug] = useState<HaritaSikayetSlug | null>(tipParam);
  const [location, setLocation] = useState<MapLocation | null>(null);
  const [adres, setAdres] = useState("");
  const [adresLoading, setAdresLoading] = useState(false);
  const [error, setError] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  const sikayet = HARITA_SIKAYETLERI.find((s) => s.slug === selectedSlug) ?? null;

  useEffect(() => {
    if (tipParam && HARITA_SIKAYETLERI.some((s) => s.slug === tipParam)) {
      setSelectedSlug(tipParam);
    }
  }, [tipParam]);

  const handleLocationChange = useCallback((loc: MapLocation) => {
    setLocation(loc);
    if (loc.adres) setAdres(loc.adres);
  }, []);

  function handleClear() {
    setLocation(null);
    setAdres("");
    setSelectedSlug(null);
    setError("");
  }

  function handleContinue() {
    setError("");
    if (!location) {
      setError("Devam etmek için haritadan konum seçmelisiniz.");
      return;
    }
    if (!selectedSlug) {
      setError("Lütfen bir şikayet türü seçin.");
      return;
    }
    if (!isInDortyolBounds(location.lat, location.lng)) {
      setError("Seçilen konum Dörtyol sınırları dışında.");
      return;
    }

    saveHaritaBasvuruKonum({
      tip: selectedSlug,
      lat: location.lat,
      lng: location.lng,
      adres: adres.trim() || location.adres || "",
      caddeSokak: location.caddeSokak,
    });
    router.push(`/basvuru/harita/basvuru?tip=${selectedSlug}`);
  }

  const locationLabel = location?.adres
    ? location.adres
    : location
      ? "Konum seçildi, adres alınıyor..."
      : "Dörtyol / Harita üzerinde konum seçin";

  return (
    <div className="flex flex-col bg-gray-100 lg:flex-row lg:h-[calc(100vh-120px)] min-h-[640px]">
      {/* Sol panel */}
      <aside className="shrink-0 flex flex-col bg-white border-b lg:border-b-0 lg:border-r border-gray-200 shadow-sm z-10 w-full lg:w-[400px] xl:w-[420px] order-1">
        <div className="bg-gradient-to-br from-primary to-primary-dark px-5 py-5 text-white">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">Vatandaş Şikayet Sistemi</h1>
              <p className="text-sm text-blue-100 mt-0.5">Sorununuzu bildirin, birlikte çözelim</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">1</span>
              <h2 className="font-semibold text-gray-900">Konum Seçin</h2>
            </div>
            <p className="text-sm text-gray-500 pl-8">
              Haritada şikayetinizin olduğu noktayı işaretleyin.
            </p>
            {location && (
              <p className="mt-2 ml-8 text-xs text-primary font-medium line-clamp-2">
                ✓ {adres || "Adres alınıyor..."}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">2</span>
              <h2 className="font-semibold text-gray-900">Şikayet Türü Seçin</h2>
            </div>
            <div className="space-y-2.5 pl-8">
              {HARITA_SIKAYETLERI.map((s) => {
                const st = CARD_STYLES[s.slug];
                const active = selectedSlug === s.slug;
                return (
                  <button
                    key={s.slug}
                    type="button"
                    onClick={() => setSelectedSlug(s.slug)}
                    className={`w-full flex items-center gap-3 rounded-xl border p-3.5 text-left transition ${
                      active
                        ? `border-transparent ring-2 ${st.ring} ${st.bg}`
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${st.bg} ${st.icon}`}>
                      <SikayetIcon slug={s.slug} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{s.label}</p>
                      <p className="text-xs text-gray-500">{st.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2.5 text-xs text-blue-800">
            Konum ve şikayet türünü seçtikten sonra başvuru formuna yönlendirileceksiniz.
          </div>
        </div>

        <div className="border-t p-4 flex gap-2 bg-white">
          <button type="button" onClick={handleClear} className="btn-secondary flex-1 text-sm gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Temizle
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={adresLoading}
            className="btn-primary flex-[1.4] text-sm gap-2 disabled:opacity-60"
          >
            Devam Et
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Harita alanı */}
      <div className="flex flex-col min-h-0 flex-1 min-h-[480px] lg:min-h-0 lg:h-full order-2">
        <div className="flex items-center justify-between gap-3 border-b bg-white px-4 py-3 shrink-0">
          <div className="flex items-center gap-2 min-w-0 text-sm">
            <svg className="w-4 h-4 shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate text-gray-700">{locationLabel}</span>
          </div>
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            className="shrink-0 text-sm font-medium text-primary hover:underline"
          >
            Yardım
          </button>
        </div>

        {showHelp && (
          <div className="bg-blue-50 border-b border-blue-100 px-4 py-3 text-sm text-blue-900 shrink-0">
            Haritaya tıklayarak konum seçin. Sokak isimleri için yakınlaştırın (+). Konumunuz Dörtyol
            ilçe sınırları içinde olmalıdır.{" "}
            <Link href="/basvuru" className="font-medium underline">
              Genel başvuru formu
            </Link>
          </div>
        )}

        <div className="relative flex-1 min-h-0 min-h-[420px]">
          <MapPickerInner
            value={location}
            onChange={handleLocationChange}
            onGeocodeLoading={setAdresLoading}
            addressFormat={sikayet?.addressFormat ?? "detailed"}
            fullHeight
            className="absolute inset-0"
          />
        </div>
      </div>
    </div>
  );
}
