export const NAV_ITEMS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/duyurular", label: "Duyurular" },
  { href: "/mudurlukler", label: "Müdürlüklerimiz" },
  { href: "/baskan-meclis", label: "Başkan & Meclis" },
  { href: "/randevu", label: "Randevu Al" },
  { href: "/iletisim", label: "İletişim" },
  { href: "/basvuru", label: "Başvuru Yap" },
  { href: "/sorgula", label: "Başvuru Sorgula" },
] as const;

export const BELEDIYE_ADI = "T.C. Dörtyol Belediyesi";
export const SISTEM_ADI = "Vatandaş Başvuru ve Yönetim Sistemi";
export const BELEDIYE_SLOGAN = "Dörtyol'un Geleceğine Birlikte";

export const DEPARTMANLAR = [
  "Fen İşleri Müdürlüğü",
  "İmar ve Şehircilik Müdürlüğü",
  "Park ve Bahçeler Müdürlüğü",
  "Zabıta Müdürlüğü",
  "Temizlik İşleri Müdürlüğü",
  "Bilgi İşlem Müdürlüğü",
  "Basın Yayın ve Halkla İlişkiler Müdürlüğü",
  "Afet İşleri ve Risk Yönetimi Müdürlüğü",
  "Emlak ve İstimlak Müdürlüğü",
  "Su ve Kanalizasyon İşleri",
  "Kültür Sanat ve Sosyal İşler Müdürlüğü",
  "Destek Hizmetleri Müdürlüğü",
  "Ruhsat ve Denetim Müdürlüğü",
] as const;

export const DURUMLAR = [
  "İncelemede",
  "Devam Ediyor",
  "Çözüldü",
  "Reddedildi",
] as const;

export type Durum = (typeof DURUMLAR)[number];

export const MENU_ITEMS = [
  ...NAV_ITEMS,
  { href: "/yonetici", label: "Belediye Yönetici Paneli" },
] as const;
