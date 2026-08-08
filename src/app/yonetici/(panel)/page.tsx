"use client";

import { useCallback, useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import AdminNav from "@/components/AdminNav";
import { DEPARTMANLAR, DURUMLAR } from "@/lib/constants";
import { getHaritaSikayetById } from "@/lib/harita";
import type { Basvuru } from "@/lib/db";

export default function YoneticiPage() {
  const [basvurular, setBasvurular] = useState<Basvuru[]>([]);
  const [filtre, setFiltre] = useState("Tümü");
  const [secilenId, setSecilenId] = useState<number | null>(null);
  const [durum, setDurum] = useState("");
  const [notlar, setNotlar] = useState("");
  const [atanan, setAtanan] = useState("");
  const [icNot, setIcNot] = useState("");
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
    if (data.length > 0) {
      setSecilenId((prev) => prev ?? data[0].id);
    }
    setLoading(false);
  }, [filtre]);

  useEffect(() => { yukle(); }, [yukle]);

  useEffect(() => {
    const b = basvurular.find((x) => x.id === secilenId);
    if (b) {
      setDurum(b.durum);
      setNotlar(b.notlar || "");
      setAtanan(b.atanan || "");
      setIcNot(b.ic_not || "");
    }
  }, [secilenId, basvurular]);

  async function guncelle() {
    if (!secilenId) return;
    const res = await fetch(`/api/basvurular/${secilenId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ durum, notlar, atanan, ic_not: icNot }),
    });
    if (res.ok) { setMsg("Başvuru güncellendi."); yukle(); }
  }

  const stats = {
    toplam: basvurular.length,
    incelemede: basvurular.filter((b) => b.durum === "İncelemede").length,
    devam: basvurular.filter((b) => b.durum === "Devam Ediyor").length,
    cozuldu: basvurular.filter((b) => b.durum === "Çözüldü").length,
  };

  return (
    <>
      <div className="site-container pt-8">
        <PageHeader
          title="Belediye Yönetici Paneli"
          subtitle="Başvuruları görüntüleyin, filtreleyin ve durumlarını güncelleyin."
          breadcrumbs={[{ label: "Yönetici Paneli" }]}
        />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <AdminNav />
          <a href="/api/basvurular/export" className="btn-secondary text-sm">
            CSV Dışa Aktar
          </a>
        </div>
      </div>

      <section className="content-section pt-0 space-y-6">
        {loading ? (
          <p className="text-gray-500">Yükleniyor...</p>
        ) : basvurular.length === 0 ? (
          <div className="info-card text-center text-gray-500 py-12">
            Henüz kayıtlı başvuru bulunmuyor.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                ["Toplam", stats.toplam, "primary"],
                ["İncelemede", stats.incelemede, "warning"],
                ["Devam Ediyor", stats.devam, "danger"],
                ["Çözüldü", stats.cozuldu, "success"],
              ].map(([label, val, cls]) => (
                <div key={label as string} className={`stat-card ${cls}`}>
                  <div className="text-2xl font-bold">{val as number}</div>
                  <div className="text-sm text-gray-500">{label}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <label className="form-label mb-0">Müdürlük Filtresi</label>
              <select
                className="form-input max-w-xs"
                value={filtre}
                onChange={(e) => { setFiltre(e.target.value); setSecilenId(null); }}
              >
                <option value="Tümü">Tümü</option>
                {DEPARTMANLAR.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {["ID", "Ad Soyad", "Müdürlük", "Konu", "Tip", "Adres", "Durum", "Tarih"].map((h) => (
                      <th key={h} className="p-3 font-semibold text-gray-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {basvurular.map((b) => (
                    <tr
                      key={b.id}
                      className={`cursor-pointer border-t transition ${secilenId === b.id ? "bg-blue-50" : "hover:bg-gray-50"}`}
                      onClick={() => setSecilenId(b.id)}
                    >
                      <td className="p-3 font-medium">{b.id}</td>
                      <td className="p-3">{b.ad_soyad}</td>
                      <td className="p-3 text-gray-500">{b.departman}</td>
                      <td className="p-3">{b.konu}</td>
                      <td className="p-3 text-gray-500">
                        {b.basvuru_tipi
                          ? getHaritaSikayetById(b.basvuru_tipi)?.label || b.basvuru_tipi
                          : "—"}
                      </td>
                      <td className="p-3 text-gray-500 max-w-[180px] truncate">{b.adres || "—"}</td>
                      <td className="p-3">
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{b.durum}</span>
                      </td>
                      <td className="p-3 text-gray-400">{b.tarih}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {secilenId && (
              <div className="info-card max-w-xl">
                <h2 className="font-semibold mb-4">Başvuru Güncelle #{secilenId}</h2>
                <div className="space-y-3">
                  <div>
                    <label className="form-label">Durum</label>
                    <select className="form-input" value={durum} onChange={(e) => setDurum(e.target.value)}>
                      {DURUMLAR.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Atanan Personel</label>
                    <input
                      className="form-input"
                      value={atanan}
                      onChange={(e) => setAtanan(e.target.value)}
                      placeholder="Sorumlu personel adı"
                    />
                  </div>
                  <div>
                    <label className="form-label">Yetkili Notu</label>
                    <textarea className="form-input" rows={3} value={notlar} onChange={(e) => setNotlar(e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">İç Not (yalnızca yönetici)</label>
                    <textarea className="form-input" rows={2} value={icNot} onChange={(e) => setIcNot(e.target.value)} />
                  </div>
                  <button onClick={guncelle} className="btn-primary">Güncelle</button>
                  {msg && <p className="text-sm text-green-600">{msg}</p>}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
