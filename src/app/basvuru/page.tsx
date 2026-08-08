"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { DEPARTMANLAR } from "@/lib/constants";

export default function BasvuruPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<number | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(null);

    const form = e.currentTarget;
    const fd = new FormData(form);

    try {
      const res = await fetch("/api/basvurular", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Başvuru gönderilemedi.");
        return;
      }
      setSuccess(data.id);
      form.reset();
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="site-container pt-8">
        <PageHeader
          title="Vatandaş Başvuru Formu"
          subtitle="Talep, öneri ve şikayetlerinizi ilgili müdürlüğe iletebilirsiniz."
          breadcrumbs={[{ label: "Başvuru Yap" }]}
        />
      </div>

      <section className="content-section pt-0">
        <div className="max-w-3xl">
          <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
            Su kesintisi, elektrik veya bozuk yol şikayeti için{" "}
            <a href="/basvuru/harita" className="font-semibold underline">
              harita üzerinden bildirim
            </a>{" "}
            yapabilirsiniz.
          </div>

          {success && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-5 text-green-800">
              <p className="font-semibold mb-1">Başvurunuz alındı!</p>
              <p className="text-sm">Başvuru Numaranız: <strong>#{success}</strong></p>
              <p className="text-xs mt-1 text-green-600">E-posta adresinize bildirim gönderildi (yapılandırıldıysa).</p>
              <button onClick={() => router.push(`/sorgula?id=${success}`)} className="mt-2 text-sm font-medium underline">
                Başvuruyu sorgula →
              </button>
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
                <label className="form-label">E-posta (bildirim için)</label>
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
              <label className="form-label">Konu *</label>
              <input name="konu" className="form-input" required placeholder="Başvuru konusu" />
            </div>
            <div>
              <label className="form-label">Detay *</label>
              <textarea name="detay" className="form-input" rows={5} required placeholder="Başvurunuzu detaylı açıklayın..." />
            </div>
            <div>
              <label className="form-label">Belge veya Resim (isteğe bağlı)</label>
              <input name="belge" type="file" className="form-input" accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx" />
              <p className="mt-1 text-xs text-gray-400">Vercel Blob yapılandırıldıysa dosya buluta yüklenir.</p>
            </div>
            <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
              {loading ? "Gönderiliyor..." : "Başvuruyu Gönder"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
