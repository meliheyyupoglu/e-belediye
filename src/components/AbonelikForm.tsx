"use client";

import { useState } from "react";

export default function AbonelikForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/abonelik", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Abonelik kaydedilemedi.");
        return;
      }
      setSuccess(true);
      setEmail("");
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h4 className="text-white font-semibold mb-2">Duyuru Aboneliği</h4>
      <p className="text-xs text-gray-400 mb-3">
        Belediye duyurularından e-posta ile haberdar olun.
      </p>
      {success && (
        <p className="mb-2 text-xs text-green-400">Aboneliğiniz kaydedildi. Teşekkürler!</p>
      )}
      {error && (
        <p className="mb-2 text-xs text-red-400">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-posta adresiniz"
          required
          className="flex-1 min-w-0 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark transition disabled:opacity-60"
        >
          {loading ? "..." : "Abone Ol"}
        </button>
      </form>
    </div>
  );
}
