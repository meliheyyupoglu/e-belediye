"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Bildirim {
  id: number;
  baslik: string;
  mesaj: string;
  okundu: number;
  tarih: string;
}

export default function NotificationBell({ overlay = false }: { overlay?: boolean }) {
  const [open, setOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [bildirimler, setBildirimler] = useState<Bildirim[]>([]);
  const [okunmamis, setOkunmamis] = useState(0);

  async function load() {
    const me = await fetch("/api/auth/citizen/me").then((r) => r.json());
    if (!me.authenticated) {
      setAuthenticated(false);
      return;
    }
    setAuthenticated(true);
    const data = await fetch("/api/bildirimler").then((r) => r.json());
    if (data.bildirimler) {
      setBildirimler(data.bildirimler);
      setOkunmamis(data.okunmamis || 0);
    }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, []);

  async function markRead(id: number) {
    await fetch(`/api/bildirimler/${id}`, { method: "PATCH" });
    load();
  }

  if (!authenticated) return null;

  const btnClass = overlay
    ? "relative rounded-full p-2.5 text-white hover:bg-white/10 transition"
    : "relative rounded-full p-2.5 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition";

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(!open)} className={btnClass} aria-label="Bildirimler">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {okunmamis > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
            {okunmamis > 9 ? "9+" : okunmamis}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute right-0 top-full z-50 mt-2 w-80 max-h-96 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
            <div className="border-b px-4 py-3 dark:border-gray-700">
              <p className="font-semibold text-gray-900 dark:text-white">Bildirimler</p>
            </div>
            {bildirimler.length === 0 ? (
              <p className="px-4 py-6 text-sm text-gray-500 text-center">Bildirim yok.</p>
            ) : (
              <ul className="divide-y dark:divide-gray-700">
                {bildirimler.map((b) => (
                  <li
                    key={b.id}
                    className={`px-4 py-3 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                      !b.okundu ? "bg-blue-50/50 dark:bg-blue-950/30" : ""
                    }`}
                    onClick={() => markRead(b.id)}
                  >
                    <p className="font-medium text-gray-900 dark:text-white">{b.baslik}</p>
                    <p className="text-gray-600 dark:text-gray-400 mt-0.5">{b.mesaj}</p>
                    <p className="text-xs text-gray-400 mt-1">{b.tarih}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
