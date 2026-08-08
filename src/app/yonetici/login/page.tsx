"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/yonetici");
      router.refresh();
    } else {
      setError("Geçersiz şifre.");
    }
    setLoading(false);
  }

  return (
    <>
      <div className="site-container pt-8">
        <PageHeader title="Yönetici Girişi" subtitle="Belediye yönetim paneline erişim" breadcrumbs={[{ label: "Giriş" }]} />
      </div>
      <section className="content-section pt-0">
        <form onSubmit={handleSubmit} className="info-card max-w-md space-y-4">
          <div>
            <label className="form-label">Yönetici Şifresi</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
              autoFocus
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </section>
    </>
  );
}
