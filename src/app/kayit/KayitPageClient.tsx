"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";

export default function KayitPageClient() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const body = {
      tc_no: fd.get("tc_no"),
      ad_soyad: fd.get("ad_soyad"),
      telefon: fd.get("telefon"),
      email: fd.get("email"),
      sifre: fd.get("sifre"),
    };

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Kayıt başarısız.");
        return;
      }
      showToast("Kayıt başarılı! Giriş yapabilirsiniz.", "success");
      router.push("/giris");
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="content-section">
      <div className="max-w-md mx-auto">
        <div className="page-header mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">Vatandaş Kayıt</h1>
          <p className="text-blue-100 text-sm mt-1">e-Belediye hesabı oluşturun</p>
        </div>

        <form onSubmit={handleSubmit} className="info-card space-y-4">
          <div>
            <label className="form-label">TC Kimlik No *</label>
            <input name="tc_no" className="form-input" maxLength={11} required pattern="\d{11}" />
          </div>
          <div>
            <label className="form-label">Ad Soyad *</label>
            <input name="ad_soyad" className="form-input" required minLength={3} />
          </div>
          <div>
            <label className="form-label">Telefon *</label>
            <input name="telefon" className="form-input" required placeholder="05XX XXX XX XX" />
          </div>
          <div>
            <label className="form-label">E-posta *</label>
            <input name="email" type="email" className="form-input" required />
          </div>
          <div>
            <label className="form-label">Şifre * (en az 6 karakter)</label>
            <input name="sifre" type="password" className="form-input" required minLength={6} />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:border-red-800 dark:text-red-300">
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Kaydediliyor..." : "Kayıt Ol"}
          </button>

          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            Zaten hesabınız var mı?{" "}
            <Link href="/giris" className="text-primary font-medium hover:underline">
              Giriş Yap
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
