"use client";

import dynamic from "next/dynamic";
import PageHeader from "@/components/PageHeader";
import AdminNav from "@/components/AdminNav";

const AdminMap = dynamic(() => import("@/components/AdminMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[480px] rounded-xl bg-gray-100 animate-pulse border border-gray-200" />
  ),
});

export default function HaritaPage() {
  return (
    <>
      <div className="site-container pt-8">
        <PageHeader
          title="Harita Görünümü"
          subtitle="Coğrafi başvurular ve kesinti bölgeleri."
          breadcrumbs={[
            { label: "Yönetici", href: "/yonetici" },
            { label: "Harita" },
          ]}
        />
        <div className="mt-4">
          <AdminNav />
        </div>
      </div>
      <section className="content-section pt-0">
        <AdminMap />
      </section>
    </>
  );
}
