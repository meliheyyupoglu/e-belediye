"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface SearchResult {
  title: string;
  href: string;
  type: string;
  snippet: string;
}

export default function HeroSearch() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/arama?q=${encodeURIComponent(q)}`);
        setResults(await res.json());
        setOpen(true);
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={wrapRef} className="relative mt-8 max-w-2xl">
      <div className="flex items-center rounded-full bg-white shadow-xl ring-1 ring-black/5">
        <svg
          className="ml-5 h-5 w-5 shrink-0 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => q.length >= 2 && setOpen(true)}
          placeholder="Hizmet, duyuru veya içerik arayın..."
          className="w-full bg-transparent px-4 py-4 text-base text-gray-800 placeholder:text-gray-400 outline-none sm:py-5 sm:text-lg"
        />
        {loading && (
          <span className="mr-5 text-sm text-gray-400 shrink-0">...</span>
        )}
      </div>

      {open && q.length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
          {loading && <p className="p-4 text-sm text-gray-400">Aranıyor...</p>}
          {!loading && results.length === 0 && (
            <p className="p-4 text-sm text-gray-400">Sonuç bulunamadı.</p>
          )}
          {results.map((r) => (
            <Link
              key={r.href + r.title}
              href={r.href}
              onClick={() => {
                setOpen(false);
                setQ("");
              }}
              className="flex items-start gap-3 border-b px-4 py-3.5 last:border-0 hover:bg-gray-50"
            >
              <span className="mt-0.5 shrink-0 rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-primary">
                {r.type}
              </span>
              <div>
                <p className="text-sm font-medium text-gray-900">{r.title}</p>
                <p className="mt-0.5 text-xs text-gray-500">{r.snippet}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
