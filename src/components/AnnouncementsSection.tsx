"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  type Announcement,
} from "@/lib/announcements";

export default function AnnouncementsSection() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/duyurular")
      .then((r) => r.json())
      .then((data) => setItems(data.slice(0, 4)))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section>
        <h2 className="section-title mb-5">Duyurular & Etkinlikler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="announcement-card animate-pulse h-32 bg-gray-100" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="section-title">Duyurular & Etkinlikler</h2>
        <Link href="/duyurular" className="text-sm font-medium text-primary hover:underline">
          Tümünü gör →
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <article key={item.id} className="announcement-card group">
            <div className="flex items-start justify-between gap-3 mb-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[item.category as keyof typeof CATEGORY_COLORS] || "bg-gray-100"}`}>
                {CATEGORY_LABELS[item.category as keyof typeof CATEGORY_LABELS] || item.category}
              </span>
              <time className="text-xs text-gray-400 shrink-0">
                {new Date(item.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
              </time>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition">
              {item.title}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2 mb-3">{item.summary}</p>
            <Link href={`/duyurular/${item.id}`} className="text-sm font-medium text-primary hover:underline">
              Devamını oku →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
