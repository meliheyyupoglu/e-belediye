import type { Basvuru, Randevu, KesintiBolgesi } from "./db";
import {
  generateDemoBasvurular,
  generateDemoRandevular,
  generateDemoKesintiler,
} from "./seed-data";

let basvurular: Basvuru[] | null = null;
let randevular: Randevu[] | null = null;
let kesintiler: KesintiBolgesi[] | null = null;
let nextBasvuruId = 2000;
let nextRandevuId = 2000;

function init() {
  if (!basvurular) basvurular = generateDemoBasvurular();
  if (!randevular) randevular = generateDemoRandevular();
  if (!kesintiler) kesintiler = generateDemoKesintiler();
}

type BasvuruEkleInput = {
  tc_no: string;
  ad_soyad: string;
  telefon: string;
  email?: string;
  departman: string;
  konu: string;
  detay: string;
  belge_dosya?: string;
  belge_url?: string;
  basvuru_tipi?: string;
  lat?: number | null;
  lng?: number | null;
  adres?: string;
  cadde_sokak?: string;
  durum?: string;
};

export function memoryBasvurulariGetir(departman?: string): Basvuru[] {
  init();
  let list = [...basvurular!];
  if (departman && departman !== "Tümü") {
    list = list.filter((b) => b.departman === departman);
  }
  return list.sort((a, b) => (b.tarih > a.tarih ? 1 : -1));
}

export function memoryBasvuruGetir(id: number): Basvuru | null {
  init();
  return basvurular!.find((b) => b.id === id) ?? null;
}

export function memoryBasvuruEkle(data: BasvuruEkleInput): number {
  init();
  const id = nextBasvuruId++;
  const tarih = new Date().toISOString().replace("T", " ").slice(0, 19);
  basvurular!.unshift({
    ...data,
    id,
    durum: data.durum || "İncelemede",
    notlar: "",
    tarih,
    ic_not: "",
    atanan: "",
    belge_dosya: data.belge_dosya || "",
    belge_url: data.belge_url || "",
    email: data.email || "",
    basvuru_tipi: data.basvuru_tipi || "",
    adres: data.adres || "",
    cadde_sokak: data.cadde_sokak || "",
  } as Basvuru);
  return id;
}

export function memoryBasvuruGuncelle(
  id: number,
  durum: string,
  notlar: string,
  atanan?: string,
  ic_not?: string
): boolean {
  init();
  const b = basvurular!.find((x) => x.id === id);
  if (!b) return false;
  b.durum = durum;
  b.notlar = notlar;
  if (atanan) b.atanan = atanan;
  if (ic_not) b.ic_not = ic_not;
  return true;
}

export function memoryRandevulariGetir(): Randevu[] {
  init();
  return [...randevular!];
}

export function memoryRandevuEkle(
  data: Omit<Randevu, "id" | "durum" | "notlar" | "olusturma">
): number {
  init();
  const id = nextRandevuId++;
  const olusturma = new Date().toISOString().replace("T", " ").slice(0, 19);
  randevular!.unshift({
    ...data,
    id,
    durum: "Beklemede",
    notlar: "",
    olusturma,
    email: data.email || "",
  });
  return id;
}

export function memoryKesintileriGetir(tip?: string): KesintiBolgesi[] {
  init();
  if (tip) return kesintiler!.filter((k) => k.tip === tip);
  return [...kesintiler!];
}

export function memoryBasvuruGecmisi(tc_no: string, telefon: string): Basvuru[] {
  init();
  const tel = telefon.replace(/[\s\-()]/g, "").slice(-10);
  return basvurular!.filter(
    (b) =>
      b.tc_no === tc_no &&
      b.telefon.replace(/[\s\-()]/g, "").includes(tel)
  );
}

export function memoryCaddeSikayetSayisi(cadde: string): number {
  init();
  return basvurular!.filter(
    (b) =>
      b.basvuru_tipi === "bozuk_yol" &&
      (b.cadde_sokak?.includes(cadde) || b.adres?.includes(cadde))
  ).length;
}
