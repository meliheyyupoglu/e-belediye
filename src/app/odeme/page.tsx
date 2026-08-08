"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";

type OdemeTipi = "su" | "emlak";

export default function OdemePage() {
  const [tip, setTip] = useState<OdemeTipi>("su");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <div className="site-container pt-8">
        <PageHeader
          title="Online Ödeme"
          subtitle="Su faturası ve emlak vergisi ödemeleri (demo arayüz)."
          breadcrumbs={[{ label: "Online Ödeme" }]}
        />
      </div>
      <section className="content-section pt-0">
        <div className="max-w-xl mx-auto">
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Bu sayfa yalnızca arayüz demonstrasyonudur. Gerçek ödeme altyapısı
            henüz entegre edilmemiştir; kart bilgileriniz işlenmez veya kaydedilmez.
          </div>

          <div className="mb-6 flex gap-2">
            <button
              type="button"
              onClick={() => { setTip("su"); setSubmitted(false); }}
              className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition ${
                tip === "su"
                  ? "border-primary bg-primary text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-primary/40"
              }`}
            >
              Su Faturası
            </button>
            <button
              type="button"
              onClick={() => { setTip("emlak"); setSubmitted(false); }}
              className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition ${
                tip === "emlak"
                  ? "border-primary bg-primary text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-primary/40"
              }`}
            >
              Emlak Vergisi
            </button>
          </div>

          {submitted ? (
            <div className="info-card text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-success">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-semibold text-gray-900">Demo ödeme simülasyonu tamamlandı</p>
              <p className="text-sm text-gray-500">
                {tip === "su" ? "Su faturası" : "Emlak vergisi"} ödemesi gerçekleştirilmedi.
                Canlı ödeme sistemi yakında devreye alınacaktır.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="btn-secondary text-sm"
              >
                Yeni işlem
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="info-card space-y-4">
              <h2 className="font-semibold text-primary">
                {tip === "su" ? "Su Faturası Ödeme" : "Emlak Vergisi Ödeme"}
              </h2>

              {tip === "su" ? (
                <>
                  <div>
                    <label className="form-label">Abone No *</label>
                    <input name="abone_no" className="form-input" required placeholder="Örn. 123456" />
                  </div>
                  <div>
                    <label className="form-label">TC Kimlik No *</label>
                    <input name="tc_no" className="form-input" required maxLength={11} pattern="\d{11}" placeholder="11 haneli TC no" />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="form-label">Ada / Parsel veya Sicil No *</label>
                    <input name="sicil_no" className="form-input" required placeholder="Tapu sicil veya ada-parsel" />
                  </div>
                  <div>
                    <label className="form-label">TC Kimlik No *</label>
                    <input name="tc_no" className="form-input" required maxLength={11} pattern="\d{11}" placeholder="11 haneli TC no" />
                  </div>
                </>
              )}

              <div>
                <label className="form-label">Ödenecek Tutar (₺) *</label>
                <input name="tutar" type="number" step="0.01" min="0" className="form-input" required placeholder="0,00" />
              </div>

              <hr className="border-gray-100" />
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Kart Bilgileri (Demo)</p>

              <div>
                <label className="form-label">Kart Üzerindeki İsim *</label>
                <input name="kart_isim" className="form-input" required placeholder="AD SOYAD" autoComplete="off" />
              </div>
              <div>
                <label className="form-label">Kart Numarası *</label>
                <input name="kart_no" className="form-input" required placeholder="0000 0000 0000 0000" maxLength={19} autoComplete="off" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Son Kullanma *</label>
                  <input name="skt" className="form-input" required placeholder="AA/YY" maxLength={5} autoComplete="off" />
                </div>
                <div>
                  <label className="form-label">CVV *</label>
                  <input name="cvv" className="form-input" required placeholder="000" maxLength={4} autoComplete="off" />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full py-3">
                Ödemeyi Simüle Et
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
