export interface Service {
  title: string;
  description: string;
  href: string;
  icon: string;
}

export const HIZMETLER: Service[] = [
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
    title: "Müdürlükler",
    description: "13 müdürlüğümüzün görev, iletişim ve detay bilgileri.",
    href: "/mudurlukler",
    icon: "mudurluk",
  },
  {
    title: "İletişim",
    description: "444 7 712 hattı ve belediye merkez adresi.",
    href: "/iletisim",
    icon: "iletisim",
  },
];
