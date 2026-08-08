"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { DEPARTMANLAR } from "@/lib/constants";

const SAATLER = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00",
];

export default function RandevuPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<number | null>(null);

  const minDate = new Date().toISOString().slice(0, 10);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(null);

    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/randevular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tc_no: fd.get("tc_no"),
          ad_soyad: fd.get("ad_soyad"),
          telefon: fd.get("telefon"),
          email: fd.get("email"),
          departman: fd.get("departman"),
          konu: fd.get("konu"),
          randevu_tarihi: fd.get("randevu_tarihi"),
          randevu_saati: fd.get("randevu_saati"),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Randevu oluşturulamadı.");
        return;
      }
      setSuccess(data.id);
      e.currentTarget.reset();
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
          title="Randevu Al"
          subtitle="Belediye müdürlüklerimizden online randevu talep edin."
          breadcrumbs={[{ label: "Randevu Al" }]}
        />
      </div>

      <section className="content-section pt-0">
        <div className="max-w-2xl">
          {success && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-5 text-green-800">
              <p className="font-semibold mb-1">Randevunuz alındı!</p>
              <p className="text-sm">Randevu Numaranız: <strong>#{success}</strong></p>
              <p className="text-xs mt-1 text-green-600">Onay için sizinle iletişime geçilecektir.</p>
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="info-card space-y-5">
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
                <label className="form-label">E-posta</label>
                <input name="email" type="email" className="form-input" placeholder="ornek@email.com" />
              </div>
              <div className="md:col-span-2">
                <label className="form-label">Müdürlük *</label>
                <select name="departman" className="form-input" required>
                  {DEPARTMANLAR.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="form-label">Randevu Konusu *</label>
              <input name="konu" className="form-input" required placeholder="Görüşmek istediğiniz konu" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="form-label">Tarih *</label>
                <input name="randevu_tarihi" type="date" className="form-input" required min={minDate} />
              </div>
              <div>
                <label className="form-label">Saat *</label>
                <select name="randevu_saati" className="form-input" required>
                  <option value="">Saat seçin</option>
                  {SAATLER.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
              {loading ? "Kaydediliyor..." : "Randevu Talep Et"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
