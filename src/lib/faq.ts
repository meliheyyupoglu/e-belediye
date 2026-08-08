export interface FaqItem {
  keywords: string[];
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    keywords: ["başvuru", "basvuru", "nasıl", "yapılır", "form"],
    answer: "Başvuru yapmak için üst menüden 'Başvuru Yap' sayfasına gidin, formu doldurup gönderin. Başvuru numaranız size verilecektir.",
  },
  {
    keywords: ["sorgula", "takip", "numara", "durum"],
    answer: "Başvuru Sorgula sayfasına başvuru numaranızı girerek sürecinizi takip edebilirsiniz.",
  },
  {
    keywords: ["telefon", "iletişim", "adres", "444"],
    answer: "Belediyemize 444 7 712 numaralı telefondan veya Numune Evler Mahallesi İstasyon Caddesi No:2 adresinden ulaşabilirsiniz.",
  },
  {
    keywords: ["müdürlük", "mudurluk", "departman"],
    answer: "13 müdürlüğümüz hakkında bilgi almak için Müdürlüklerimiz sayfasını ziyaret edebilirsiniz.",
  },
  {
    keywords: ["ruhsat", "işyeri", "açma"],
    answer: "İş yeri açma ruhsatı işlemleri Ruhsat ve Denetim Müdürlüğü tarafından yürütülmektedir. Detaylar için müdürlük sayfasına bakın.",
  },
  {
    keywords: ["imar", "inşaat", "ruhsat"],
    answer: "İmar ve inşaat ruhsatı işlemleri İmar ve Şehircilik Müdürlüğü'ne aittir.",
  },
  {
    keywords: ["çöp", "temizlik", "süpürme"],
    answer: "Temizlik hizmetleri Temizlik İşleri Müdürlüğü tarafından yürütülmektedir. Şikayetlerinizi başvuru formu ile iletebilirsiniz.",
  },
  {
    keywords: ["park", "yeşil", "ağaç"],
    answer: "Park ve yeşil alan hizmetleri Park ve Bahçeler Müdürlüğü sorumluluğundadır.",
  },
  {
    keywords: ["merhaba", "selam", "hey"],
    answer: "Merhaba! T.C. Dörtyol Belediyesi e-Belediye asistanına hoş geldiniz. Size nasıl yardımcı olabilirim?",
  },
];

export function findFaqAnswer(message: string): string {
  const lower = message.toLowerCase();
  for (const item of FAQ_ITEMS) {
    if (item.keywords.some((k) => lower.includes(k))) {
      return item.answer;
    }
  }
  return "Bu konuda size yardımcı olmak isterim. Başvuru yapmak için 'Başvuru Yap', süreç takibi için 'Başvuru Sorgula' sayfalarını kullanabilir veya 444 7 712 numarasını arayabilirsiniz.";
}
