export const DORTYOL_CENTER = { lat: 36.8392, lng: 36.2167 };

export const DORTYOL_BOUNDS = {
  minLat: 36.78,
  maxLat: 36.9,
  minLng: 36.12,
  maxLng: 36.35,
};

export function isInDortyolBounds(lat: number, lng: number): boolean {
  return (
    lat >= DORTYOL_BOUNDS.minLat &&
    lat <= DORTYOL_BOUNDS.maxLat &&
    lng >= DORTYOL_BOUNDS.minLng &&
    lng <= DORTYOL_BOUNDS.maxLng
  );
}

export const HARITA_SIKAYETLERI = [
  {
    slug: "su-kesintisi",
    id: "su_kesintisi",
    label: "Su Kesintisi",
    description: "Ev veya iş yerinizde su kesintisi veya su arızası bildirin.",
    departman: "Su ve Kanalizasyon İşleri",
    konu: "Su Kesintisi Bildirimi",
    mapLabel: "Ev veya iş yeri konumunuzu haritadan seçin",
    showCaddeSokak: false,
    requireMap: true,
    addressFormat: "detailed",
    color: "border-t-blue-500",
    iconBg: "bg-blue-50 text-blue-600",
  },
  {
    slug: "elektrik",
    id: "elektrik",
    label: "Elektrik Arızası",
    description: "Elektrik kesintisi veya arıza bildirimi yapın.",
    departman: "Fen İşleri Müdürlüğü",
    konu: "Elektrik Arızası Bildirimi",
    mapLabel: "Ev veya iş yeri konumunuzu haritadan seçin",
    showCaddeSokak: false,
    requireMap: true,
    addressFormat: "detailed",
    color: "border-t-yellow-500",
    iconBg: "bg-yellow-50 text-yellow-600",
  },
  {
    slug: "bozuk-yol",
    id: "bozuk_yol",
    label: "Bozuk Yol",
    description: "Hasarlı cadde veya sokak bildirimi — haritadan işaretleyin veya yazın.",
    departman: "Fen İşleri Müdürlüğü",
    konu: "Bozuk Yol Bildirimi",
    mapLabel: "Hasarlı yolun konumunu haritadan işaretleyin",
    showCaddeSokak: true,
    requireMap: false,
    addressFormat: "road",
    color: "border-t-orange-500",
    iconBg: "bg-orange-50 text-orange-600",
  },
] as const;

export type HaritaSikayetSlug = (typeof HARITA_SIKAYETLERI)[number]["slug"];

export function getHaritaSikayet(slug: string) {
  return HARITA_SIKAYETLERI.find((s) => s.slug === slug);
}

export function getHaritaSikayetById(id: string) {
  return HARITA_SIKAYETLERI.find((s) => s.id === id);
}

/** Basitleştirilmiş Dörtyol mahalle merkezleri */
export const MAHALLE_NOKTALARI = [
  { ad: "Numune Evler", lat: 36.8395, lng: 36.2180 },
  { ad: "Yeni Camii", lat: 36.8410, lng: 36.2140 },
  { ad: "Altınçağ", lat: 36.8350, lng: 36.2220 },
  { ad: "Cumhuriyet", lat: 36.8430, lng: 36.2100 },
  { ad: "Sanayi", lat: 36.8320, lng: 36.2050 },
] as const;
