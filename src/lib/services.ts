export interface Service {
  title: string;
  description: string;
  href: string;
  icon: string;
}

export const HIZMETLER: Service[] = [
  {
    title: "Harita ile Şikayet",
    description: "Su kesintisi, elektrik arızası ve bozuk yol bildirimi — haritadan konum seçin.",
    href: "/basvuru/harita",
    icon: "harita",
  },
  {
    title: "Online Başvuru",
    description: "Talep, öneri ve şikayetlerinizi ilgili müdürlüğe iletin.",
    href: "/basvuru",
    icon: "basvuru",
  },
  {
    title: "Başvuru Takibi",
    description: "Başvuru numaranız ile sürecinizi anlık olarak sorgulayın.",
    href: "/sorgula",
    icon: "sorgula",
  },
  {
    title: "Başvuru Geçmişim",
    description: "TC ve telefon ile OTP doğrulaması sonrası tüm başvurularınızı görün.",
    href: "/basvuru/gecmis",
    icon: "gecmis",
  },
  {
    title: "Randevu Al",
    description: "Müdürlüklerimizden online randevu talep edin.",
    href: "/randevu",
    icon: "randevu",
  },
  {
    title: "Müdürlükler",
    description: "13 müdürlüğümüzün görev, iletişim ve detay bilgileri.",
    href: "/mudurlukler",
    icon: "mudurluk",
  },
  {
    title: "Projeler",
    description: "Belediyemizin devam eden ve tamamlanan projeleri.",
    href: "/projeler",
    icon: "proje",
  },
  {
    title: "Etkinlikler",
    description: "Kültür, sanat ve sosyal etkinlik takvimi.",
    href: "/etkinlikler",
    icon: "etkinlik",
  },
  {
    title: "Online Ödeme",
    description: "Belediye borçlarınızı güvenle ödeyin.",
    href: "/odeme",
    icon: "odeme",
  },
  {
    title: "İletişim",
    description: "444 7 712 hattı ve belediye merkez adresi.",
    href: "/iletisim",
    icon: "iletisim",
  },
];
