"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

    const body = {
      tc_no: fd.get("tc_no"),
      ad_soyad: fd.get("ad_soyad"),
      telefon: fd.get("telefon"),
      departman: fd.get("departman"),
      konu: fd.get("konu"),
      detay: fd.get("detay"),
      belge_dosya: (fd.get("belge") as File)?.name || "",
    };

    try {
      const res = await fetch("/api/basvurular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Basvuru gonderilemedi");
        return;
      }
      setSuccess(data.id);
      form.reset();
    } catch {
      setError("Baglanti hatasi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-primary">
        Vatandas Basvuru Formu
      </h1>

      {success && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
          Basvurunuz alindi. Basvuru Numaraniz: <strong>#{success}</strong>
          <button
            onClick={() => router.push(`/sorgula?id=${success}`)}
            className="ml-3 text-sm underline"
          >
            Sorgula
          </button>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="form-label">TC Kimlik No *</label>
            <input
              name="tc_no"
              className="form-input"
              maxLength={11}
              required
              pattern="\d{11}"
            />
          </div>
          <div>
            <label className="form-label">Ad Soyad *</label>
            <input name="ad_soyad" className="form-input" required />
          </div>
          <div>
            <label className="form-label">Telefon *</label>
            <input name="telefon" className="form-input" required />
          </div>
          <div>
            <label className="form-label">Mudurluk *</label>
            <select name="departman" className="form-input" required>
              {DEPARTMANLAR.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="form-label">Konu *</label>
          <input name="konu" className="form-input" required />
        </div>
        <div>
          <label className="form-label">Detay *</label>
          <textarea name="detay" className="form-input" rows={5} required />
        </div>
        <div>
          <label className="form-label">Belge veya Resim (istege bagli)</label>
          <input
            name="belge"
            type="file"
            className="form-input"
            accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx"
          />
          <p className="mt-1 text-xs text-gray-500">
            Dosya adi kaydedilir. Tam dosya depolama icin Turso/Vercel Blob
            entegrasyonu gerekebilir.
          </p>
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Gonderiliyor..." : "Basvuruyu Gonder"}
        </button>
      </form>
    </div>
  );
}
