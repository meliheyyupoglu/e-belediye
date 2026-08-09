"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import AdminNav from "@/components/AdminNav";
import { getHaritaSikayetById } from "@/lib/harita";

interface DashboardStats {
  toplam: number;
  incelemede: number;
  devam: number;
  cozuldu: number;
  harita: number;
  randevu: number;
  topMahalle: [string, number][];
  tipDagilim: { su: number; elektrik: number; yol: number; dilek: number };
}

interface RandevuRow {
  id: number;
  ad_soyad: string;
  departman: string;
  konu: string;
  randevu_tarihi: string;
  randevu_saati: string;
  durum: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [randevular, setRandevular] = useState<RandevuRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetch("/api/admin/stats"), fetch("/api/randevular")])
      .then(async ([statsRes, randevuRes]) => {
        setStats(await statsRes.json());
        setRandevular(await randevuRes.json());
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="site-container pt-8">
        <PageHeader
          title="Dashboard"
          subtitle="Genel istatistikler ve özet bilgiler."
          breadcrumbs={[
            { label: "Yönetici", href: "/yonetici" },
            { label: "Dashboard" },
          ]}
        />
        <div className="mt-4">
          <AdminNav />
        </div>
      </div>
      <section className="content-section pt-0 space-y-8">
        {loading ? (
          <p className="text-gray-500">Yükleniyor...</p>
        ) : stats ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                ["Toplam Başvuru", stats.toplam, "primary"],
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="stat-card primary">
                <div className="text-2xl font-bold">{stats.harita}</div>
                <div className="text-sm text-gray-500">Harita Başvurusu</div>
              </div>
              <div className="stat-card warning">
                <div className="text-2xl font-bold">{stats.randevu}</div>
                <div className="text-sm text-gray-500">Bekleyen Randevu</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="info-card">
                <h2 className="font-semibold mb-4">Başvuru Tipi Dağılımı</h2>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>{getHaritaSikayetById("su_kesintisi")?.label || "Su Kesintisi"}</span>
                    <span className="font-medium">{stats.tipDagilim.su}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>{getHaritaSikayetById("elektrik")?.label || "Elektrik"}</span>
                    <span className="font-medium">{stats.tipDagilim.elektrik}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>{getHaritaSikayetById("bozuk_yol")?.label || "Bozuk Yol"}</span>
                    <span className="font-medium">{stats.tipDagilim.yol}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Dilek / Genel Başvuru</span>
                    <span className="font-medium">{stats.tipDagilim.dilek}</span>
                  </li>
                </ul>
              </div>

              <div className="info-card">
                <h2 className="font-semibold mb-4">En Çok Başvuru — Mahalle</h2>
                {stats.topMahalle.length === 0 ? (
                  <p className="text-sm text-gray-500">Veri yok.</p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {stats.topMahalle.map(([mahalle, count]) => (
                      <li key={mahalle} className="flex justify-between">
                        <span>{mahalle}</span>
                        <span className="font-medium">{count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="info-card overflow-x-auto">
              <h2 className="font-semibold mb-4">Randevular</h2>
              {randevular.length === 0 ? (
                <p className="text-sm text-gray-500">Randevu kaydı yok.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      {["Ad Soyad", "Müdürlük", "Konu", "Tarih", "Saat", "Durum"].map((h) => (
                        <th key={h} className="p-2 text-left font-semibold text-gray-600">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {randevular.slice(0, 20).map((r) => (
                      <tr key={r.id} className="border-t">
                        <td className="p-2">{r.ad_soyad}</td>
                        <td className="p-2 text-gray-600">{r.departman}</td>
                        <td className="p-2">{r.konu}</td>
                        <td className="p-2">{r.randevu_tarihi}</td>
                        <td className="p-2">{r.randevu_saati}</td>
                        <td className="p-2">{r.durum}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        ) : (
          <p className="text-gray-500">İstatistikler yüklenemedi.</p>
        )}
      </section>
    </>
  );
}
