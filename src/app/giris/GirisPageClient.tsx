"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";

export default function GirisPageClient() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/auth/citizen/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tc_no: fd.get("tc_no"), sifre: fd.get("sifre") }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Giriş başarısız.");
        return;
      }
      showToast(`Hoş geldiniz, ${data.user.ad_soyad}!`, "success");
      router.push("/basvuru/gecmis");
      router.refresh();
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
          <h1 className="text-xl sm:text-2xl font-bold">Vatandaş Girişi</h1>
          <p className="text-blue-100 text-sm mt-1">Hesabınıza giriş yapın</p>
        </div>

        <form onSubmit={handleSubmit} className="info-card space-y-4">
          <div>
            <label className="form-label">TC Kimlik No *</label>
            <input name="tc_no" className="form-input" maxLength={11} required pattern="\d{11}" />
          </div>
          <div>
            <label className="form-label">Şifre *</label>
            <input name="sifre" type="password" className="form-input" required />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:border-red-800 dark:text-red-300">
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>

          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            Hesabınız yok mu?{" "}
            <Link href="/kayit" className="text-primary font-medium hover:underline">
              Kayıt Ol
            </Link>
          </p>
          <p className="text-xs text-center text-gray-400">
            Belediye personeli için{" "}
            <Link href="/yonetici/login" className="text-primary hover:underline">
              yönetici girişi
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
