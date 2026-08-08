"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DEPARTMANLAR } from "@/lib/constants";
import { MUDURLUK_BILGILERI } from "@/lib/mudurlukler";
import { MUDURLUK_TO_SLUG } from "@/lib/slug";

export default function MudurlukGrid() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return DEPARTMANLAR;
    return DEPARTMANLAR.filter((ad) => {
      const bilgi = MUDURLUK_BILGILERI[ad];
      return (
        ad.toLowerCase().includes(q) ||
        bilgi?.mudur?.toLowerCase().includes(q) ||
        bilgi?.aciklama?.toLowerCase().includes(q)
      );
    });
  }, [search]);

  return (
    <div>
      <div className="mb-6 relative max-w-md">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          placeholder="Müdürlük veya müdür adı ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Aramanızla eşleşen müdürlük bulunamadı.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((ad) => {
            const bilgi = MUDURLUK_BILGILERI[ad];
            const slug = MUDURLUK_TO_SLUG[ad];
            return (
              <article key={ad} className="mudurluk-card hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-primary mb-1">{ad}</h3>
                {bilgi?.mudur && (
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="text-gray-400">Müdür:</span> {bilgi.mudur}
                  </p>
                )}
                {bilgi?.telefon_dahili && (
                  <p className="text-xs text-gray-400 mb-2">
                    Dahili: {bilgi.telefon_dahili}
                  </p>
                )}
                <p className="text-sm text-gray-500 line-clamp-3 mb-4">
                  {bilgi?.aciklama}
                </p>
                <Link
                  href={`/mudurlukler/${slug}`}
                  className="btn-primary text-sm"
                >
                  Detayları Gör
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
