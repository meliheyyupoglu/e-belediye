"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import MapEmbed from "@/components/MapEmbed";
import { BELEDIYE_ILETISIM } from "@/lib/mudurlukler";

export default function IletisimPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/iletisim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ad_soyad: fd.get("ad_soyad"),
          email: fd.get("email"),
          telefon: fd.get("telefon"),
          konu: fd.get("konu"),
          mesaj: fd.get("mesaj"),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setSuccess(true);
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
          title="İletişim"
          subtitle="Belediyemize ulaşın, sorularınızı ve görüşlerinizi iletin."
          breadcrumbs={[{ label: "İletişim" }]}
        />
      </div>
      <section className="content-section pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="info-card">
              <h2 className="font-semibold text-primary mb-3">İletişim Bilgileri</h2>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><strong>Adres:</strong><br />{BELEDIYE_ILETISIM.adres}</li>
                <li><strong>Telefon:</strong>{" "}
                  <a href={`tel:${BELEDIYE_ILETISIM.telefon.replace(/\s/g, "")}`} className="text-primary hover:underline">
                    {BELEDIYE_ILETISIM.telefon}
                  </a>
                </li>
                <li><strong>Santral:</strong> {BELEDIYE_ILETISIM.telefon_santral}</li>
                <li><strong>Web:</strong>{" "}
                  <a href="https://www.dortyol.bel.tr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    www.dortyol.bel.tr
                  </a>
                </li>
              </ul>
            </div>
            <MapEmbed />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 mb-4">Bize Yazın</h2>
            {success && (
              <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800 text-sm">
                Mesajınız başarıyla iletildi. En kısa sürede dönüş yapılacaktır.
              </div>
            )}
            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 text-sm">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="info-card space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Ad Soyad *</label>
                  <input name="ad_soyad" className="form-input" required />
                </div>
                <div>
                  <label className="form-label">E-posta *</label>
                  <input name="email" type="email" className="form-input" required />
                </div>
              </div>
              <div>
                <label className="form-label">Telefon</label>
                <input name="telefon" className="form-input" />
              </div>
              <div>
                <label className="form-label">Konu *</label>
                <input name="konu" className="form-input" required />
              </div>
              <div>
                <label className="form-label">Mesajınız *</label>
                <textarea name="mesaj" className="form-input" rows={5} required />
              </div>
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? "Gönderiliyor..." : "Mesaj Gönder"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
