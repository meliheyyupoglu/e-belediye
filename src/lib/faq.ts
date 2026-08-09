export interface FaqItem {
  keywords: string[];
  answer: string;
  priority?: number;
}

function getTurkeyHour(): number {
  return parseInt(
    new Intl.DateTimeFormat("tr-TR", {
      hour: "numeric",
      hour12: false,
      timeZone: "Europe/Istanbul",
    }).format(new Date()),
    10
  );
}

export function getTimeGreeting(): string {
  const hour = getTurkeyHour();
  if (hour >= 6 && hour < 12) return "Günaydın";
  if (hour >= 12 && hour < 18) return "Merhaba, iyi günler";
  if (hour >= 18 && hour < 23) return "İyi akşamlar";
  return "İyi geceler";
}

export function getWelcomeMessage(): string {
  return `${getTimeGreeting()}! T.C. Dörtyol Belediyesi e-Belediye asistanıyım. Başvuru, şikayet, müdürlükler ve iletişim konularında size yardımcı olabilirim. Ne sormak istersiniz?`;
}

const SMALL_TALK: { patterns: string[]; answer: string | (() => string) }[] = [
  {
    patterns: ["merhaba", "selam", "selamün aleyküm", "selamun aleykum", "hey", "hello", "hi"],
    answer: () =>
      `${getTimeGreeting()}! Hoş geldiniz. Başvuru, şikayet veya belediye hizmetleri hakkında sorularınızı yanıtlayabilirim.`,
  },
  {
    patterns: ["günaydın", "gunaydin", "iyi günler", "iyi gunler"],
    answer: () => `${getTimeGreeting()}! Size nasıl yardımcı olabilirim?`,
  },
  {
    patterns: ["iyi akşamlar", "iyi aksamlar"],
    answer: () => `${getTimeGreeting()}! Dörtyol Belediyesi e-Belediye asistanıyım, buyurun.`,
  },
  {
    patterns: ["iyi geceler"],
    answer: "İyi geceler! Geç saatte de buradayım, sorularınızı yanıtlamaktan memnuniyet duyarım.",
  },
  {
    patterns: ["nasılsın", "nasilsin", "naber", "ne haber", "n'aber", "napiyorsun"],
    answer:
      "İyiyim, teşekkür ederim! Sizin için buradayım. Başvuru takibi, harita ile şikayet veya müdürlük bilgisi isterseniz yardımcı olayım.",
  },
  {
    patterns: ["teşekkür", "tesekkur", "sağol", "sagol", "eyvallah", "thanks", "teşekkürler"],
    answer: "Rica ederim! Başka bir konuda yardıma ihtiyacınız olursa yazmanız yeterli.",
  },
  {
    patterns: ["görüşürüz", "gorusuruz", "hoşça kal", "hosca kal", "bye", "güle güle", "gule gule"],
    answer: "Görüşmek üzere! Dörtyol Belediyesi her zaman hizmetinizde.",
  },
  {
    patterns: ["kimsin", "sen kimsin", "ne işe yarıyorsun", "ne ise yariyorsun"],
    answer:
      "Ben Dörtyol Belediyesi e-Belediye dijital asistanıyım. Başvuru süreçleri, şikayet bildirimi, müdürlük bilgileri, iletişim ve sık sorulan sorular konusunda yönlendirme yapabilirim.",
  },
  {
    patterns: ["yardım", "yardim", "ne sorabilirim", "neler sorabilirim", "ne yapabilirsin"],
    answer:
      "Şunlar hakkında soru sorabilirsiniz:\n• Online başvuru ve takip\n• Harita ile su/elektrik/yol şikayeti\n• Müdürlükler ve görevleri\n• İletişim ve çalışma saatleri\n• Ruhsat, imar, temizlik, park hizmetleri\n• Duyurular ve etkinlikler",
  },
  {
    patterns: ["tamam", "ok", "anladım", "anladim", "peki"],
    answer: "Tamamdır. Başka bir sorunuz olursa çekinmeden yazın.",
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    keywords: ["başvuru yap", "basvuru yap", "başvuru nasıl", "basvuru nasil", "form doldur", "online başvuru"],
    answer:
      "Online başvuru için üst menüden 'Başvuru Yap' sayfasına gidin. TC kimlik no, iletişim bilgileri, müdürlük ve konuyu doldurup gönderin. Başvuru numaranız anında verilir.",
    priority: 2,
  },
  {
    keywords: ["sorgula", "takip", "başvuru numarası", "basvuru numarasi", "durum", "ne oldu", "sonuç"],
    answer:
      "'Başvuru Sorgula' sayfasına başvuru numaranızı girerek durumunuzu (İncelemede, Devam Ediyor, Çözüldü) anlık takip edebilirsiniz.",
    priority: 2,
  },
  {
    keywords: ["harita", "su kesintisi", "su kesildi", "su yok", "elektrik kesildi", "elektrik yok", "bozuk yol", "çukur", "cukur", "sokak bozuk"],
    answer:
      "'Harita ile Şikayet' bölümünden su kesintisi, elektrik arızası veya bozuk yol bildirimi yapabilirsiniz. Haritadan konumunuzu seçin, adres otomatik dolar ve şikayetinizi iletin.",
    priority: 2,
  },
  {
    keywords: ["telefon", "444", "ara", "numara", "fax"],
    answer: "Belediyemize 444 7 712 numaralı telefondan ulaşabilirsiniz. Fax: 0326 712 40 01.",
    priority: 1,
  },
  {
    keywords: ["adres", "nerede", "konum", "belediye binası", "belediye binasi", "harita"],
    answer:
      "Belediye binamız: Numune Evler Mahallesi İstasyon Caddesi No:2, Dörtyol/Hatay. İletişim sayfasından haritayı da görebilirsiniz.",
    priority: 1,
  },
  {
    keywords: ["e-posta", "eposta", "email", "mail"],
    answer: "Belediyemize info@dortyol.bel.tr adresinden e-posta gönderebilirsiniz.",
  },
  {
    keywords: ["çalışma saati", "calisma saati", "mesai", "açık", "acik", "kaça kadar", "kaca kadar", "pazar"],
    answer:
      "Belediyemiz hafta içi 08:00–17:00 saatleri arasında hizmet vermektedir. Resmi tatil ve hafta sonu kapalıdır. Acil durumlar için 444 7 712 hattını arayabilirsiniz.",
  },
  {
    keywords: ["müdürlük", "mudurluk", "departman", "birim", "13 müdürlük"],
    answer:
      "13 müdürlüğümüz hakkında görev, müdür ve iletişim bilgileri için 'Müdürlüklerimiz' sayfasını ziyaret edebilirsiniz.",
  },
  {
    keywords: ["başkan", "baskan", "belediye başkanı", "belediye baskani", "bahadır", "bahadir", "amaç", "amac"],
    answer:
      "Belediye Başkanımız Dr. Bahadır Amaç. Başkan ve Meclis üyeleri hakkında bilgi için 'Başkan & Meclis' sayfasına bakabilirsiniz.",
  },
  {
    keywords: ["meclis", "belediye meclisi", "üye", "parti"],
    answer:
      "Dörtyol Belediye Meclisi 30 üyeden oluşmaktadır. Meclis üyeleri ve parti bilgileri 'Başkan & Meclis' sayfasında yer almaktadır.",
  },
  {
    keywords: ["duyuru", "haber", "etkinlik", "duyurular"],
    answer: "Güncel duyuru ve haberler için 'Duyurular' sayfasını ziyaret edebilirsiniz.",
  },
  {
    keywords: ["ruhsat", "işyeri açma", "isyeri acma", "iş yeri"],
    answer:
      "İş yeri açma ruhsatı işlemleri Ruhsat ve Denetim Müdürlüğü tarafından yürütülür. Gerekli belgeler için müdürlük sayfasına bakın veya başvuru formu ile talepte bulunun.",
  },
  {
    keywords: ["imar", "inşaat", "insaat", "yapı ruhsatı", "yapi ruhsati", "kat irtifak"],
    answer:
      "İmar ve inşaat ruhsatı işlemleri İmar ve Şehircilik Müdürlüğü'ne aittir. Detaylı bilgi için müdürlük sayfasını ziyaret edin.",
  },
  {
    keywords: ["çöp", "cop", "temizlik", "süpürme", "supurme", "atık", "atik"],
    answer:
      "Temizlik ve çöp toplama hizmetleri Temizlik İşleri Müdürlüğü tarafından yürütülür. Şikayetlerinizi başvuru formu veya harita ile iletebilirsiniz.",
  },
  {
    keywords: ["park", "yeşil alan", "yesil alan", "ağaç", "agac", "bahçe", "bahce"],
    answer:
      "Park, bahçe ve yeşil alan hizmetleri Park ve Bahçeler Müdürlüğü sorumluluğundadır.",
  },
  {
    keywords: ["su", "kanalizasyon", "fatura", "su abonelik", "borç"],
    answer:
      "Su ve kanalizasyon işlemleri Su ve Kanalizasyon İşleri birimine aittir. Su kesintisi bildirimi için 'Harita ile Şikayet > Su Kesintisi' bölümünü kullanabilirsiniz.",
  },
  {
    keywords: ["zabıta", "zabita", "gürültü", "gurultu", "işgal", "tezgah"],
    answer:
      "Zabıta hizmetleri ve şikayetleri Zabıta Müdürlüğü tarafından yürütülür. Başvuru formu ile bildirimde bulunabilirsiniz.",
  },
  {
    keywords: ["fen işleri", "fen isleri", "yol", "asfalt", "kaldırım", "kaldirim", "aydınlatma"],
    answer:
      "Yol, kaldırım ve aydınlatma işleri Fen İşleri Müdürlüğü tarafından yapılır. Bozuk yol şikayeti için harita ile bildirim yapabilirsiniz.",
  },
  {
    keywords: ["emlak vergisi", "emlak", "vergi", "beyan"],
    answer:
      "Emlak vergisi işlemleri Emlak ve İstimlak Müdürlüğü tarafından yürütülür. Detaylı bilgi için müdürlük sayfasına bakın.",
  },
  {
    keywords: ["nikah", "evlilik", "evlenme", "nikah salonu"],
    answer:
      "Nikah işlemleri Kültür Sanat ve Sosyal İşler Müdürlüğü bünyesinde yürütülür. Randevu ve belgeler için belediyemizi arayabilirsiniz.",
  },
  {
    keywords: ["sosyal yardım", "yardım", "muhtaç", "muhtac", "destek"],
    answer:
      "Sosyal yardım talepleri Kültür Sanat ve Sosyal İşler Müdürlüğü'ne iletilir. Başvuru formu ile talepte bulunabilirsiniz.",
  },
  {
    keywords: ["kültür", "kultur", "sanat", "konser", "tiyatro", "festival"],
    answer:
      "Kültür ve sanat etkinlikleri Kültür Sanat ve Sosyal İşler Müdürlüğü tarafından düzenlenir. Duyurular sayfasından güncel etkinlikleri takip edebilirsiniz.",
  },
  {
    keywords: ["afet", "deprem", "sel", "acil", "toplanma"],
    answer:
      "Afet ve acil durum işlemleri Afet İşleri ve Risk Yönetimi Müdürlüğü tarafından koordine edilir. Acil durumlarda 112'yi arayın.",
  },
  {
    keywords: ["e-devlet", "edevlet", "giriş", "giris", "login"],
    answer:
      "e-Devlet ile giriş özelliği şu an aktif değildir. Başvuru ve sorgulama işlemlerinizi sitemiz üzerinden gerçekleştirebilirsiniz.",
  },
  {
    keywords: ["belge", "dosya", "fotoğraf", "fotograf", "pdf", "yükle", "yukle"],
    answer:
      "Başvuru formunda isteğe bağlı olarak belge veya fotoğraf yükleyebilirsiniz. Dosya yükleme Vercel Blob yapılandırıldığında aktif olur.",
  },
  {
    keywords: ["sms", "bildirim", "e-posta bildirim", "haber ver"],
    answer:
      "Başvurunuz alındığında e-posta adresinize bildirim gönderilir (yapılandırıldıysa). Başvuru numaranızı not alarak 'Başvuru Sorgula' sayfasından takip edebilirsiniz.",
  },
  {
    keywords: ["şikayet", "sikayet", "talep", "öneri", "oneri"],
    answer:
      "Talep, öneri ve şikayetlerinizi 'Başvuru Yap' formu ile iletebilir veya su/elektrik/yol için 'Harita ile Şikayet' bölümünü kullanabilirsiniz.",
  },
  {
    keywords: ["iletişim formu", "iletisim formu", "mesaj gönder", "mesaj gonder"],
    answer:
      "Belediyemize doğrudan mesaj göndermek için 'İletişim' sayfasındaki formu kullanabilirsiniz.",
  },
  {
    keywords: ["web sitesi", "site", "portal", "e-belediye", "e belediye"],
    answer:
      "Dörtyol Belediyesi e-Belediye Portalı; online başvuru, harita ile şikayet, duyurular, müdürlük bilgileri ve başvuru takibi hizmetleri sunmaktadır.",
  },
];

export const QUICK_QUESTIONS = [
  "Başvuru nasıl yapılır?",
  "Başvuru sorgulama",
  "Harita ile şikayet",
  "İletişim bilgileri",
  "Çalışma saatleri",
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
}

function matchSmallTalk(message: string): string | null {
  const norm = normalize(message);
  for (const item of SMALL_TALK) {
    if (item.patterns.some((p) => norm.includes(normalize(p)))) {
      return typeof item.answer === "function" ? item.answer() : item.answer;
    }
  }
  return null;
}

function matchFaq(message: string): string | null {
  const norm = normalize(message);
  let bestScore = 0;
  let bestAnswer: string | null = null;

  for (const item of FAQ_ITEMS) {
    let score = 0;
    for (const keyword of item.keywords) {
      if (norm.includes(normalize(keyword))) {
        score += 1 + (item.priority || 0);
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestAnswer = item.answer;
    }
  }

  return bestScore > 0 ? bestAnswer : null;
}

export function findFaqAnswer(message: string): string {
  const trimmed = message.trim();
  if (!trimmed) return "Lütfen bir mesaj yazın.";

  const smallTalk = matchSmallTalk(trimmed);
  if (smallTalk) return smallTalk;

  const faq = matchFaq(trimmed);
  if (faq) return faq;

  return (
    `${getTimeGreeting()}! Bu konuda net bir yanıtım yok ama yardımcı olmaya çalışayım.\n\n` +
    "Deneyebileceğiniz seçenekler:\n" +
    "• Başvuru Yap — talep ve şikayet\n" +
    "• Harita ile Şikayet — su, elektrik, yol\n" +
    "• Başvuru Sorgula — takip numarası ile\n" +
    "• 444 7 712 — belediye hattı\n\n" +
    "Daha spesifik sorarsanız (ör. 'su kesintisi', 'ruhsat', 'çalışma saati') daha iyi yanıt verebilirim."
  );
}
