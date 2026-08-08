"use client";

import { useCallback, useEffect, useState } from "react";
import { DEPARTMANLAR, DURUMLAR } from "@/lib/constants";
import type { Basvuru } from "@/lib/db";

export default function YoneticiPage() {
  const [basvurular, setBasvurular] = useState<Basvuru[]>([]);
  const [filtre, setFiltre] = useState("Tümü");
  const [secilenId, setSecilenId] = useState<number | null>(null);
  const [durum, setDurum] = useState("");
  const [notlar, setNotlar] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const yukle = useCallback(async () => {
    setLoading(true);
    const url =
      filtre === "Tümü"
        ? "/api/basvurular"
        : `/api/basvurular?departman=${encodeURIComponent(filtre)}`;
    const res = await fetch(url);
    const data = await res.json();
    setBasvurular(data);
    if (data.length > 0 && !secilenId) {
      setSecilenId(data[0].id);
      setDurum(data[0].durum);
      setNotlar(data[0].notlar || "");
    }
    setLoading(false);
  }, [filtre, secilenId]);

  useEffect(() => {
    yukle();
  }, [yukle]);

  useEffect(() => {
    const b = basvurular.find((x) => x.id === secilenId);
    if (b) {
      setDurum(b.durum);
      setNotlar(b.notlar || "");
    }
  }, [secilenId, basvurular]);

  async function guncelle() {
    if (!secilenId) return;
    const res = await fetch(`/api/basvurular/${secilenId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ durum, notlar }),
    });
    if (res.ok) {
      setMsg("Başvuru güncellendi.");
      yukle();
    }
  }

  const stats = {
    toplam: basvurular.length,
    incelemede: basvurular.filter((b) => b.durum === "İncelemede").length,
    devam: basvurular.filter((b) => b.durum === "Devam Ediyor").length,
    cozuldu: basvurular.filter((b) => b.durum === "Çözüldü").length,
  };

  if (loading && basvurular.length === 0) {
    return <p className="text-gray-500">Yükleniyor...</p>;
  }

  if (basvurular.length === 0 && filtre === "Tümü") {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold text-primary">
          Belediye Yönetici Paneli
        </h1>
        <p className="text-gray-500">Henüz kayıtlı başvuru bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-primary">
        Belediye Yönetici Paneli
      </h1>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="stat-card primary">
          <div className="text-2xl font-bold">{stats.toplam}</div>
          <div className="text-sm text-gray-500">Toplam</div>
        </div>
        <div className="stat-card warning">
          <div className="text-2xl font-bold">{stats.incelemede}</div>
          <div className="text-sm text-gray-500">İncelemede</div>
        </div>
        <div className="stat-card danger">
          <div className="text-2xl font-bold">{stats.devam}</div>
          <div className="text-sm text-gray-500">Devam Ediyor</div>
        </div>
        <div className="stat-card success">
          <div className="text-2xl font-bold">{stats.cozuldu}</div>
          <div className="text-sm text-gray-500">Çözüldü</div>
        </div>
      </div>

      <div className="mb-4">
        <label className="form-label">Müdürlük Filtresi</label>
        <select
          className="form-input max-w-xs"
          value={filtre}
          onChange={(e) => {
            setFiltre(e.target.value);
            setSecilenId(null);
          }}
        >
          <option value="Tümü">Tümü</option>
          {DEPARTMANLAR.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6 overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Ad Soyad</th>
              <th className="p-3">Müdürlük</th>
              <th className="p-3">Konu</th>
              <th className="p-3">Durum</th>
              <th className="p-3">Tarih</th>
            </tr>
          </thead>
          <tbody>
            {basvurular.map((b) => (
              <tr
                key={b.id}
                className={`cursor-pointer border-t ${secilenId === b.id ? "bg-blue-50" : "hover:bg-gray-50"}`}
                onClick={() => setSecilenId(b.id)}
              >
                <td className="p-3">{b.id}</td>
                <td className="p-3">{b.ad_soyad}</td>
                <td className="p-3">{b.departman}</td>
                <td className="p-3">{b.konu}</td>
                <td className="p-3">{b.durum}</td>
                <td className="p-3">{b.tarih}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {secilenId && (
        <div className="info-card max-w-xl">
          <h2 className="mb-4 font-semibold">Başvuru Güncelle #{secilenId}</h2>
          <div className="mb-3">
            <label className="form-label">Durum</label>
            <select
              className="form-input"
              value={durum}
              onChange={(e) => setDurum(e.target.value)}
            >
              {DURUMLAR.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Yetkili Notu</label>
            <textarea
              className="form-input"
              rows={3}
              value={notlar}
              onChange={(e) => setNotlar(e.target.value)}
            />
          </div>
          <button onClick={guncelle} className="btn-primary">
            Güncelle
          </button>
          {msg && <p className="mt-2 text-sm text-green-600">{msg}</p>}
        </div>
      )}
    </div>
  );
}
