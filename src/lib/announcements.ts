export interface Announcement {
  id: string;
  title: string;
  summary: string;
  content?: string;
  date: string;
  category: "duyuru" | "etkinlik" | "ihale";
  href?: string;
}

export const SEED_DUYURULAR: Announcement[] = [
  {
    id: "1",
    title: "e-Belediye Başvuru Sistemi Yayında",
    summary: "Vatandaşlarımız talep, öneri ve şikayetlerini artık online olarak iletebilir.",
    content: "T.C. Dörtyol Belediyesi e-Belediye portalı üzerinden vatandaşlarımız talep, öneri ve şikayetlerini ilgili müdürlüklere online olarak iletebilir, başvuru numarası ile süreci takip edebilir.",
    date: "2026-08-08",
    category: "duyuru",
    href: "/basvuru",
  },
  {
    id: "2",
    title: "Yaz Spor Okulları Kayıtları Başladı",
    summary: "Kültür Sanat ve Sosyal İşler Müdürlüğü bünyesinde yaz spor okulu kayıtları devam etmektedir.",
    content: "Dörtyol Belediyesi Kültür Sanat ve Sosyal İşler Müdürlüğü bünyesinde yaz spor okulu kayıtları başlamıştır. Detaylı bilgi için müdürlüğümüze başvurabilirsiniz.",
    date: "2026-07-15",
    category: "etkinlik",
    href: "/mudurlukler/kultur-sanat-ve-sosyal-isler-mudurlugu",
  },
  {
    id: "3",
    title: "Park ve Yeşil Alan Bakım Çalışmaları",
    summary: "İlçe genelinde park ve yeşil alan bakım-onarım çalışmaları sürdürülmektedir.",
    content: "Park ve Bahçeler Müdürlüğü tarafından ilçe genelinde planlı bakım ve iyileştirme çalışmaları yürütülmektedir.",
    date: "2026-07-01",
    category: "duyuru",
    href: "/mudurlukler/park-ve-bahceler-mudurlugu",
  },
  {
    id: "4",
    title: "Afet Hazırlık Eğitimleri",
    summary: "Mahalle bazlı bilgilendirme toplantıları düzenlenmektedir.",
    content: "Afet İşleri ve Risk Yönetimi Müdürlüğü kapsamında vatandaşlarımızın bilinçlendirilmesi amacıyla eğitim programları düzenlenmektedir.",
    date: "2026-06-20",
    category: "etkinlik",
    href: "/mudurlukler/afet-isleri-ve-risk-yonetimi-mudurlugu",
  },
];

export const CATEGORY_LABELS: Record<Announcement["category"], string> = {
  duyuru: "Duyuru",
  etkinlik: "Etkinlik",
  ihale: "İhale",
};

export const CATEGORY_COLORS: Record<Announcement["category"], string> = {
  duyuru: "bg-blue-100 text-blue-800",
  etkinlik: "bg-green-100 text-green-800",
  ihale: "bg-orange-100 text-orange-800",
};
