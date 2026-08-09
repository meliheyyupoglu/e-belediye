"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface SearchResult {
  title: string;
  href: string;
  type: string;
  snippet: string;
}

export default function SearchModal({ overlay = false }: { overlay?: boolean }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (q.length < 2) { setResults([]); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/arama?q=${encodeURIComponent(q)}`);
        setResults(await res.json());
      } catch { setResults([]); }
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className={
          overlay
            ? "flex items-center justify-center rounded-full p-2.5 text-white/90 transition hover:bg-white/10 min-h-[44px] min-w-[44px]"
            : "flex items-center justify-center gap-1.5 p-2.5 sm:px-2 sm:py-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg hover:border-primary hover:text-primary transition min-h-[44px] min-w-[44px] sm:min-w-0"
        }
        aria-label="Ara"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden md:inline">Ara...</span>
        <kbd className="hidden md:inline text-xs bg-gray-100 px-1.5 py-0.5 rounded">Ctrl+K</kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start sm:items-start justify-center pt-4 sm:pt-20 px-3 sm:px-4 bg-black/50" onClick={() => setOpen(false)}>
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden animate-slide-up sm:animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Müdürlük, duyuru veya sayfa ara..."
            className="flex-1 outline-none text-base sm:text-sm min-h-[44px]"
          />
          <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-sm p-2 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
            <span className="sm:hidden">✕</span>
            <span className="hidden sm:inline">Esc</span>
          </button>
        </div>
        <div className="max-h-[60dvh] sm:max-h-80 overflow-y-auto">
          {loading && <p className="p-4 text-sm text-gray-400">Aranıyor...</p>}
          {!loading && q.length >= 2 && results.length === 0 && (
            <p className="p-4 text-sm text-gray-400">Sonuç bulunamadı.</p>
          )}
          {results.map((r) => (
            <Link
              key={r.href + r.title}
              href={r.href}
              onClick={() => setOpen(false)}
              className="flex items-start gap-3 px-4 py-3.5 hover:bg-gray-50 active:bg-gray-100 border-b last:border-0 min-h-[56px]"
            >
              <span className="text-xs font-medium bg-blue-50 text-primary px-2 py-0.5 rounded shrink-0 mt-0.5">{r.type}</span>
              <div>
                <p className="text-sm font-medium text-gray-900">{r.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{r.snippet}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
