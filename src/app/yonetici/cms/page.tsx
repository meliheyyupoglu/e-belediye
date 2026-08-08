"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { CATEGORY_LABELS } from "@/lib/announcements";

interface Duyuru {
  id: number;
  title: string;
  summary: string;
  content: string;
  date: string;
  category: string;
  href: string;
  active: number;
}

export default function CmsPage() {
  const [duyurular, setDuyurular] = useState<Duyuru[]>([]);
  const [form, setForm] = useState({ title: "", summary: "", content: "", category: "duyuru", href: "" });
  const [msg, setMsg] = useState("");

  async function yukle() {
    const res = await fetch("/api/duyurular");
    setDuyurular(await res.json());
  }

  useEffect(() => { yukle(); }, []);

  async function ekle(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/duyurular", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, date: new Date().toISOString().slice(0, 10) }),
    });
    if (res.ok) {
      setMsg("Duyuru eklendi.");
      setForm({ title: "", summary: "", content: "", category: "duyuru", href: "" });
      yukle();
    }
  }

  async function sil(id: number) {
    if (!confirm("Bu duyuruyu silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/duyurular?id=${id}`, { method: "DELETE" });
    yukle();
  }

  return (
    <>
      <div className="site-container pt-8">
        <PageHeader
          title="CMS - Duyuru Yönetimi"
          subtitle="Duyuru, etkinlik ve ihale içeriklerini yönetin."
          breadcrumbs={[
            { label: "Yönetici", href: "/yonetici" },
            { label: "CMS" },
          ]}
        />
      </div>
      <section className="content-section pt-0 space-y-8">
        <div className="flex gap-3">
          <Link href="/yonetici" className="btn-secondary text-sm">← Başvuru Paneli</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form onSubmit={ekle} className="info-card space-y-4">
            <h2 className="font-semibold">Yeni Duyuru Ekle</h2>
            <div>
              <label className="form-label">Başlık *</label>
              <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <label className="form-label">Özet *</label>
              <textarea className="form-input" rows={2} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} required />
            </div>
            <div>
              <label className="form-label">İçerik</label>
              <textarea className="form-input" rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Kategori</label>
                <select className="form-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="duyuru">Duyuru</option>
                  <option value="etkinlik">Etkinlik</option>
                  <option value="ihale">İhale</option>
                </select>
              </div>
              <div>
                <label className="form-label">Link (isteğe bağlı)</label>
                <input className="form-input" value={form.href} onChange={(e) => setForm({ ...form, href: e.target.value })} placeholder="/basvuru" />
              </div>
            </div>
            <button type="submit" className="btn-primary">Duyuru Ekle</button>
            {msg && <p className="text-sm text-green-600">{msg}</p>}
          </form>

          <div>
            <h2 className="font-semibold mb-4">Mevcut Duyurular ({duyurular.length})</h2>
            <div className="space-y-3">
              {duyurular.map((d) => (
                <div key={d.id} className="info-card flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs text-gray-400">{CATEGORY_LABELS[d.category as keyof typeof CATEGORY_LABELS]} · {d.date}</span>
                    <p className="font-medium text-sm mt-0.5">{d.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{d.summary}</p>
                  </div>
                  <button onClick={() => sil(d.id)} className="text-xs text-red-500 hover:text-red-700 shrink-0">Sil</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
