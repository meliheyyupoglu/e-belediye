"use client";

import { useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import type { Basvuru } from "@/lib/db";
import { getHaritaSikayetById } from "@/lib/harita";

const DURUM_COLORS: Record<string, string> = {
  "İncelemede": "bg-yellow-100 text-yellow-800",
  "Devam Ediyor": "bg-blue-100 text-blue-800",
  "Çözüldü": "bg-green-100 text-green-800",
  "Reddedildi": "bg-red-100 text-red-800",
};

type Step = "form" | "otp" | "list";

export default function BasvuruGecmisPage() {
  const [step, setStep] = useState<Step>("form");
  const [tcNo, setTcNo] = useState("");
  const [telefon, setTelefon] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [basvurular, setBasvurular] = useState<Basvuru[]>([]);

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tc_no: tcNo, telefon, email: email || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "OTP gönderilemedi.");
        return;
      }
      setInfo(data.message + (data.maskedEmail ? ` (${data.maskedEmail})` : ""));
      setStep("otp");
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const verifyRes = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tc_no: tcNo, telefon, otp }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        setError(verifyData.error || "Doğrulama başarısız.");
        return;
      }

      const res = await fetch("/api/basvurular/gecmis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tc_no: tcNo, telefon, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Başvurular alınamadı.");
        return;
      }
      setBasvurular(data.basvurular || []);
      setStep("list");
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
          title="Başvuru Geçmişim"
          subtitle="TC kimlik numaranız ve telefonunuz ile geçmiş başvurularınızı görüntüleyin."
          breadcrumbs={[{ label: "Başvuru Geçmişim" }]}
        />
      </div>

      <section className="content-section pt-0">
        <div className="max-w-2xl">
          {step === "form" && (
            <form onSubmit={sendOtp} className="info-card space-y-4">
              <p className="text-sm text-gray-600">
                Güvenlik için e-posta adresinize tek kullanımlık doğrulama kodu gönderilir.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">TC Kimlik No *</label>
                  <input
                    value={tcNo}
                    onChange={(e) => setTcNo(e.target.value)}
                    className="form-input"
                    maxLength={11}
                    required
                    pattern="\d{11}"
                    placeholder="11 haneli TC no"
                  />
                </div>
                <div>
                  <label className="form-label">Telefon *</label>
                  <input
                    value={telefon}
                    onChange={(e) => setTelefon(e.target.value)}
                    className="form-input"
                    required
                    placeholder="05XX XXX XX XX"
                  />
                </div>
              </div>
              <div>
                <label className="form-label">E-posta (OTP için, kayıtlı değilse zorunlu)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="ornek@email.com"
                />
              </div>
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 text-sm">{error}</div>
              )}
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? "Gönderiliyor..." : "Doğrulama Kodu Gönder"}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={verifyOtp} className="info-card space-y-4">
              {info && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-800 text-sm">
                  {info}
                </div>
              )}
              <div>
                <label className="form-label">6 Haneli Doğrulama Kodu *</label>
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="form-input text-center text-lg tracking-widest"
                  maxLength={6}
                  required
                  pattern="\d{6}"
                  placeholder="000000"
                />
              </div>
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 text-sm">{error}</div>
              )}
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep("form")} className="btn-secondary flex-1">
                  Geri
                </button>
                <button type="submit" className="btn-primary flex-1" disabled={loading}>
                  {loading ? "Doğrulanıyor..." : "Doğrula ve Listele"}
                </button>
              </div>
            </form>
          )}

          {step === "list" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">
                  {basvurular.length} başvuru bulundu
                </h2>
                <button
                  type="button"
                  onClick={() => { setStep("form"); setOtp(""); setBasvurular([]); }}
                  className="text-sm text-primary hover:underline"
                >
                  Yeni sorgulama
                </button>
              </div>

              {basvurular.length === 0 ? (
                <div className="info-card text-sm text-gray-600">
                  Bu bilgilerle eşleşen başvuru bulunamadı.
                </div>
              ) : (
                basvurular.map((b) => (
                  <div key={b.id} className="info-card">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <Link href={`/sorgula?id=${b.id}`} className="font-bold text-primary hover:underline">
                          Başvuru #{b.id}
                        </Link>
                        <p className="text-sm text-gray-500 mt-0.5">{b.tarih}</p>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${DURUM_COLORS[b.durum] || "bg-gray-100"}`}>
                        {b.durum}
                      </span>
                    </div>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div>
                        <dt className="text-gray-400 text-xs">Müdürlük</dt>
                        <dd className="font-medium">{b.departman}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-400 text-xs">Konu</dt>
                        <dd className="font-medium">{b.konu}</dd>
                      </div>
                      {b.basvuru_tipi && (
                        <div>
                          <dt className="text-gray-400 text-xs">Tip</dt>
                          <dd>{getHaritaSikayetById(b.basvuru_tipi)?.label || b.basvuru_tipi}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
