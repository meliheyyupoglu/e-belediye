"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import BasvuruQrCode from "@/components/BasvuruQrCode";
import { getHaritaSikayet, isInDortyolBounds } from "@/lib/harita";
import { loadHaritaBasvuruKonum, type HaritaBasvuruKonum } from "@/lib/harita-basvuru-storage";
import type { MapLocation } from "@/components/MapPickerInner";

const MapPickerInner = dynamic(() => import("@/components/MapPickerInner"), {
  ssr: false,
  loading: () => <div className="h-[200px] bg-gray-100 animate-pulse rounded-xl" />,
});

export default function HaritaSikayetBasvuruClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tip = searchParams.get("tip");

  const [konum, setKonum] = useState<HaritaBasvuruKonum | null>(null);
  const [ready, setReady] = useState(false);
  const [adres, setAdres] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const sikayet = tip ? getHaritaSikayet(tip) : null;

  useEffect(() => {
    const s = tip ? getHaritaSikayet(tip) : null;
    const saved = loadHaritaBasvuruKonum();
    if (!tip || !s || !saved || saved.tip !== tip) {
      router.replace("/basvuru/harita");
      return;
    }
    if (!isInDortyolBounds(saved.lat, saved.lng)) {
      router.replace("/basvuru/harita");
      return;
    }
    setKonum(saved);
    setAdres(saved.adres);
    setReady(true);
  }, [tip, router]);

  const mapLocation: MapLocation | null = konum
    ? { lat: konum.lat, lng: konum.lng, adres: konum.adres, caddeSokak: konum.caddeSokak }
    : null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!sikayet || !konum) return;
    setError("");

    if (!adres.trim()) {
      setError("Lütfen adres bilgisini doldurun.");
      return;
    }

    const form = e.currentTarget;
    const fd = new FormData(form);
    const file = fd.get("belge") as File | null;
    if (sikayet.id === "bozuk_yol" && (!file || file.size === 0)) {
      setError("Bozuk yol bildirimi için fotoğraf zorunludur.");
      return;
    }

    setLoading(true);
    fd.set("departman", sikayet.departman);
    fd.set("konu", sikayet.konu);
    fd.set("basvuru_tipi", sikayet.id);
    fd.set("adres", adres.trim());
    fd.set("lat", String(konum.lat));
    fd.set("lng", String(konum.lng));
    if (konum.caddeSokak) fd.set("cadde_sokak", konum.caddeSokak);

    try {
      const res = await fetch("/api/basvurular", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Şikayet gönderilemedi.");
        return;
      }
      setSuccess(data.id);
      form.reset();
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  }

  if (!ready || !sikayet || !konum) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-gray-500">
        Başvuru formu yükleniyor...
      </div>
    );
  }

  if (success) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10">
        <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-green-800">
          <p className="text-lg font-semibold mb-1">Şikayetiniz alındı!</p>
          <p className="text-sm">Başvuru No: <strong>#{success}</strong></p>
          <button
            type="button"
            onClick={() => router.push(`/sorgula?id=${success}`)}
            className="mt-2 text-sm font-medium underline"
          >
            Başvuruyu sorgula →
          </button>
          <BasvuruQrCode basvuruId={success} />
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link href="/basvuru/harita" className="btn-primary flex-1 text-center text-sm">
              Yeni Şikayet
            </Link>
            <Link href="/" className="btn-secondary flex-1 text-center text-sm">
              Ana Sayfa
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-120px)] bg-gray-50">
      <div className="bg-gradient-to-br from-primary to-primary-dark px-4 py-5 text-white">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/basvuru/harita"
            className="inline-flex items-center gap-1 text-sm text-blue-100 hover:text-white mb-3"
          >
            ← Haritaya dön
          </Link>
          <h1 className="text-xl font-bold">{sikayet.label} — Başvuru Formu</h1>
          <p className="text-sm text-blue-100 mt-1">Seçtiğiniz konum için şikayet detaylarını doldurun</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b px-4 py-2.5 text-sm text-gray-600 flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span className="truncate">{adres || "Seçilen konum"}</span>
          </div>
          <div className="h-[200px]">
            <MapPickerInner
              value={mapLocation}
              onChange={() => {}}
              addressFormat={sikayet.addressFormat}
              fullHeight={false}
              compact
              readOnly
              className="h-full"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
          <div>
            <label className="form-label">Adres *</label>
            <input
              value={adres}
              onChange={(e) => setAdres(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="form-label">TC Kimlik No *</label>
              <input name="tc_no" className="form-input" maxLength={11} required pattern="\d{11}" />
            </div>
            <div>
              <label className="form-label">Ad Soyad *</label>
              <input name="ad_soyad" className="form-input" required />
            </div>
            <div>
              <label className="form-label">Telefon *</label>
              <input name="telefon" className="form-input" required placeholder="05XX XXX XX XX" />
            </div>
            <div>
              <label className="form-label">E-posta</label>
              <input name="email" type="email" className="form-input" />
            </div>
          </div>

          <div>
            <label className="form-label">Açıklama *</label>
            <textarea name="detay" className="form-input" rows={4} required />
          </div>

          <div>
            <label className="form-label">
              Fotoğraf {sikayet.id === "bozuk_yol" ? "*" : "(isteğe bağlı)"}
            </label>
            <input
              name="belge"
              type="file"
              className="form-input"
              accept=".png,.jpg,.jpeg,.webp"
              required={sikayet.id === "bozuk_yol"}
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
            {loading ? "Gönderiliyor..." : "Şikayeti Gönder"}
          </button>
        </form>
      </div>
    </div>
  );
}
