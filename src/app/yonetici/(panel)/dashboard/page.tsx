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
  tipDagilim: { su: number; elektrik: number; yol: number };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
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
          </>
        ) : (
          <p className="text-gray-500">İstatistikler yüklenemedi.</p>
        )}
      </section>
    </>
  );
}
