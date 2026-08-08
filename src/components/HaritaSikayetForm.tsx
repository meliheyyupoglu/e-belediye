"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MapLocationPicker, { type MapLocation } from "@/components/MapLocationPicker";
import BasvuruQrCode from "@/components/BasvuruQrCode";
import { isInDortyolBounds, type HARITA_SIKAYETLERI } from "@/lib/harita";

type SikayetTip = (typeof HARITA_SIKAYETLERI)[number];

interface Props {
  sikayet: SikayetTip;
}

export default function HaritaSikayetForm({ sikayet }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<number | null>(null);
  const [location, setLocation] = useState<MapLocation | null>(null);
  const [adres, setAdres] = useState("");
  const [adresLoading, setAdresLoading] = useState(false);

  function handleLocationChange(loc: MapLocation) {
    setLocation(loc);
    if (loc.adres) setAdres(loc.adres);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (sikayet.requireMap && !location) {
      setError("Lütfen haritadan konumunuzu seçin.");
      return;
    }
    if (!adres.trim() && sikayet.requireMap) {
      setError("Lütfen adres bilgisini doldurun.");
      return;
    }
    if (sikayet.showCaddeSokak && !location && !adres.trim()) {
      setError("Lütfen haritadan konum seçin veya adres yazın.");
      return;
    }
    if (location && !isInDortyolBounds(location.lat, location.lng)) {
      setError("Seçilen konum Dörtyol ilçe sınırları dışında. Lütfen Dörtyol içinde bir nokta seçin.");
      return;
    }

    const form = e.currentTarget;
    const fd = new FormData(form);
    const file = fd.get("belge") as File | null;
    if (sikayet.id === "bozuk_yol" && (!file || file.size === 0)) {
      setError("Bozuk yol bildirimi için fotoğraf yüklemeniz zorunludur.");
      return;
    }

    setLoading(true);

    fd.set("departman", sikayet.departman);
    fd.set("konu", sikayet.konu);
    fd.set("basvuru_tipi", sikayet.id);
    fd.set("adres", adres.trim());
    if (location) {
      fd.set("lat", String(location.lat));
      fd.set("lng", String(location.lng));
    }
    if (location?.caddeSokak) fd.set("cadde_sokak", location.caddeSokak);

    try {
      const res = await fetch("/api/basvurular", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Şikayet gönderilemedi.");
        return;
      }
      setSuccess(data.id);
      form.reset();
      setLocation(null);
      setAdres("");
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {success && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-5 text-green-800">
          <p className="font-semibold mb-1">Şikayetiniz alındı!</p>
          <p className="text-sm">Başvuru Numaranız: <strong>#{success}</strong></p>
          <button onClick={() => router.push(`/sorgula?id=${success}`)} className="mt-2 text-sm font-medium underline">
            Başvuruyu sorgula →
          </button>
          <BasvuruQrCode basvuruId={success} />
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="info-card space-y-5">
        <MapLocationPicker
          value={location}
          onChange={handleLocationChange}
          onGeocodeLoading={setAdresLoading}
          mapLabel={sikayet.mapLabel}
          addressFormat={sikayet.addressFormat}
          kesintiTip={sikayet.id === "su_kesintisi" ? "su_kesintisi" : sikayet.id === "elektrik" ? "elektrik" : undefined}
        />

        <div>
          <label className="form-label">Adres {sikayet.requireMap ? "*" : ""}</label>
          <input
            name="adres_display"
            value={adres}
            onChange={(e) => setAdres(e.target.value)}
            className="form-input"
            placeholder={adresLoading ? "Adres alınıyor..." : "Haritadan seçin veya elle yazın"}
            disabled={adresLoading}
          />
          <p className="mt-1 text-xs text-gray-400">
            Haritaya tıkladığınızda adres otomatik dolar. Gerekirse düzenleyebilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="form-label">TC Kimlik No *</label>
            <input name="tc_no" className="form-input" maxLength={11} required pattern="\d{11}" placeholder="11 haneli TC no" />
          </div>
          <div>
            <label className="form-label">Ad Soyad *</label>
            <input name="ad_soyad" className="form-input" required placeholder="Adınız Soyadınız" />
          </div>
          <div>
            <label className="form-label">Telefon *</label>
            <input name="telefon" className="form-input" required placeholder="05XX XXX XX XX" />
          </div>
          <div>
            <label className="form-label">E-posta (bildirim için)</label>
            <input name="email" type="email" className="form-input" placeholder="ornek@email.com" />
          </div>
        </div>

        <div>
          <label className="form-label">Açıklama *</label>
          <textarea
            name="detay"
            className="form-input"
            rows={4}
            required
            placeholder={
              sikayet.id === "su_kesintisi"
                ? "Su kesintisi ne zaman başladı, hangi saatlerde oluyor..."
                : sikayet.id === "elektrik"
                  ? "Elektrik ne zaman kesildi, hangi bölgede etkileniyor..."
                  : "Yolun durumu, çukur derinliği, trafik etkisi..."
            }
          />
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
          {sikayet.id === "bozuk_yol" && (
            <p className="mt-1 text-xs text-gray-400">Hasarlı yolun fotoğrafını eklemeniz gerekmektedir.</p>
          )}
        </div>

        <input type="hidden" name="departman" value={sikayet.departman} />
        <input type="hidden" name="konu" value={sikayet.konu} />

        <button type="submit" className="btn-primary w-full py-3" disabled={loading || adresLoading}>
          {loading ? "Gönderiliyor..." : "Şikayeti Gönder"}
        </button>
      </form>
    </>
  );
}
