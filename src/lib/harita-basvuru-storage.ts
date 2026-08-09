import type { HaritaSikayetSlug } from "./harita";

export const HARITA_BASVURU_KEY = "harita-basvuru-konum";

export type HaritaBasvuruKonum = {
  tip: HaritaSikayetSlug;
  lat: number;
  lng: number;
  adres: string;
  caddeSokak?: string;
};

export function saveHaritaBasvuruKonum(data: HaritaBasvuruKonum): void {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(HARITA_BASVURU_KEY, JSON.stringify(data));
}

export function loadHaritaBasvuruKonum(): HaritaBasvuruKonum | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(HARITA_BASVURU_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as HaritaBasvuruKonum;
  } catch {
    return null;
  }
}
