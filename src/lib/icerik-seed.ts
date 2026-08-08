import type { Icerik } from "@/lib/db";

export interface IcerikSeed extends Omit<Icerik, "active"> {
  href?: string;
  active?: number;
}

/** Kaynak: dortyol.bel.tr ve resmi belediye duyuruları */
export const PROJELER: IcerikSeed[] = [
  {
    id: 1,
    tip: "proje",
    title: "Yeşilköy Plajı ve Atatürk Parkı Projesi",
    summary: "Dörtyol sahil şeridinde 27 dönümlük alanda plaj, park, su oyun parkı ve sosyal donatılar.",
    content:
      "Hatay Büyükşehir Belediyesi koordinasyonunda Dörtyol sahil şeridinde yürütülen Yeşilköy Plajı ve Atatürk Parkı Projesi kapsamında Atatürk Parkı revize edilmekte, plaj alanı daha elverişli hale getirilmektedir. 27 dönümlük alanda 2 çocuk oyun parkı, fitness alanı, su oyun parkı, kamelya, barbekü, mescit, plaj voleybol sahası, mini futbol sahası, soyunma kabinleri ve büfe yer alacaktır.",
    date: "2025-09-18",
    image_url: "",
    href: "https://www.dortyol.bel.tr",
  },
  {
    id: 2,
    tip: "proje",
    title: "2025-2029 Stratejik Plan",
    summary: "Dörtyol Belediyesi beş yıllık stratejik planı; şeffaf yönetim ve sürdürülebilir kalkınma hedefleri.",
    content:
      "Dörtyol Belediyesi 2025-2029 Stratejik Planı, kurum içi SWOT analizi ve vatandaş görüş anketleriyle hazırlanmıştır. Mali yapının güçlendirilmesi, afet ve felaketlere karşı önleyici tedbirler, çağdaş ulaşım sistemleri ve vatandaş memnuniyetinin artırılması temel hedefler arasındadır.",
    date: "2025-05-13",
    image_url: "",
    href: "https://www.dortyol.bel.tr/stratejik-plan",
  },
  {
    id: 3,
    tip: "proje",
    title: "Özerli Mahallesi Kültürel Salon Projesi",
    summary: "Özerli Mahallesi'nde çok amaçlı kültürel salon inşaatı — ihale süreci tamamlandı.",
    content:
      "Dörtyol Belediyesi ve Hatay Büyükşehir Belediyesi iş birliğiyle Özerli Mahallesi'nde planlanan çok amaçlı kültürel salon projesinin ihale süreci tamamlanmış olup inşaata geçilmiştir.",
    date: "2025-07-15",
    image_url: "",
    href: "https://www.dortyol.bel.tr",
  },
  {
    id: 4,
    tip: "proje",
    title: "Ocaklı Mahallesi Kültürel Salon Projesi",
    summary: "Ocaklı Mahallesi'nde yeni kültürel salon için ihale ve inşa süreci başlatıldı.",
    content:
      "Ocaklı Mahallesi'nde vatandaşlarımızın sosyal ve kültürel ihtiyaçlarını karşılamak amacıyla planlanan kültürel salon projesi için ihale çalışmaları tamamlanmış, kısa süre içinde inşaata başlanacaktır.",
    date: "2025-08-01",
    image_url: "",
    href: "https://www.dortyol.bel.tr",
  },
  {
    id: 5,
    tip: "proje",
    title: "Su Şebekesi Yenileme ve Asfalt Çalışmaları",
    summary: "Mahallelerde su şebekesi değişiminin ardından kapsamlı asfalt yenileme çalışmaları.",
    content:
      "Dörtyol genelinde sürdürülen su şebekesi değişim çalışmalarının tamamlanmasının ardından Fen İşleri Müdürlüğü ekipleri asfalt yapımına geçmiştir. Belediyemiz araç ve personel desteğiyle yol sorunlarının giderilmesi hedeflenmektedir.",
    date: "2025-06-20",
    image_url: "",
    href: "https://www.dortyol.bel.tr",
  },
  {
    id: 6,
    tip: "proje",
    title: "Numune Evler Mahallesi Kreş Projesi",
    summary: "Hatay Büyükşehir Belediyesi iş birliğiyle Numune Evler Mahallesi'ne kreş yapılması.",
    content:
      "Dörtyol Belediye Başkanı Dr. Bahadır Amaç'ın Hatay Büyükşehir Belediyesi Başkanı Mehmet Öntürk ile gerçekleştirdiği görüşmede Numune Evler Mahallesi'ne kreş yapılması talep edilmiş, proje destek sözü alınmıştır.",
    date: "2025-07-10",
    image_url: "",
    href: "https://www.dortyol.bel.tr",
  },
  {
    id: 7,
    tip: "proje",
    title: "Millet Bahçesi Duvar ve Otopark İnşaatı",
    summary: "Millet Bahçesi dış saha duvarı ve otopark duvarlarının inşa edilmesi projesi.",
    content:
      "Dörtyol Millet Bahçesi'nin güvenliği ve kullanılabilirliğinin artırılması amacıyla dış saha duvarı ile otopark duvarlarının inşa edilmesi için Hatay Büyükşehir Belediyesi'nden destek talep edilmiştir.",
    date: "2025-07-10",
    image_url: "",
    href: "https://www.dortyol.bel.tr",
  },
  {
    id: 8,
    tip: "proje",
    title: "Beşikgöl Mesire Alanı Asfalt Projesi",
    summary: "Beşikgöl mesire alanına ulaşım için asfalt ve altyapı iyileştirme çalışmaları.",
    content:
      "Beşikgöl'deki devam eden mesire alanı projelerine ulaşımı kolaylaştırmak amacıyla asfalt ve altyapı iyileştirme talebi Hatay Büyükşehir Belediyesi'ne iletilmiştir.",
    date: "2025-07-10",
    image_url: "",
    href: "https://www.dortyol.bel.tr/onemli-mekanlar",
  },
  {
    id: 9,
    tip: "proje",
    title: "2026 Yılı Performans Programı",
    summary: "Belediyemizin 2026 mali yılı hedefleri; şeffaf ve hesap verebilir yönetim anlayışı.",
    content:
      "Dörtyol Belediyesi 2026 Yılı Performans Programı, stratejik plan hedefleri doğrultusunda hazırlanmıştır. Mali yapının güçlendirilmesi, afet ve felaketlere karşı önleyici tedbirler ve ulaşım altyapısının iyileştirilmesi programın temel unsurlarıdır.",
    date: "2025-10-09",
    image_url: "",
    href: "https://www.dortyol.bel.tr/upload/file/2026-yili-dortyol-belediyesi-performans-programi.pdf",
  },
  {
    id: 10,
    tip: "proje",
    title: "Gençler İçin Halı Saha ve Spor Tesisleri",
    summary: "Gençlerin kötü alışkanlıklardan uzak tutulması amacıyla halı saha ve spor tesisi projesi.",
    content:
      "Dörtyol Belediyesi, gençlerimizi sporla buluşturmak amacıyla halı saha ve spor tesisleri yapılması için Hatay Büyükşehir Belediyesi'nden destek talep etmiştir.",
    date: "2025-07-10",
    image_url: "",
    href: "https://www.dortyol.bel.tr",
  },
];

export const ETKINLIKLER: IcerikSeed[] = [
  {
    id: 101,
    tip: "etkinlik",
    title: "TEKNOFEST 2026 Teknoloji Yarışmaları",
    summary: "Geleceği üreten gençler için TEKNOFEST 2026 teknoloji yarışmalarına başvurular başladı.",
    content:
      "Dörtyol Belediyesi'nin duyurduğu TEKNOFEST 2026 Teknoloji Yarışmaları kapsamında gençlerimizin başvuruları alınmaktadır. TEKNOFEST, Türkiye'nin en büyük teknoloji ve havacılık festivali olup gençleri bilim ve teknolojiye teşvik etmeyi amaçlamaktadır.",
    date: "2026-01-29",
    image_url: "",
    href: "https://www.dortyol.bel.tr/gelecegi-uretenler-teknofest-te-bulusuyor-2026-teknoloji-yarismalarina-basvurular-basladi",
  },
  {
    id: 102,
    tip: "etkinlik",
    title: "TÜBİTAK 4007 Bilim Şenlikleri Programı",
    summary: "Bilim ve teknoloji farkındalığı için TÜBİTAK destekli bilim şenlikleri başvuruları açıldı.",
    content:
      "TÜBİTAK 4007 Bilim Şenlikleri Destekleme Programı'nın 11. çağrısı yayımlandı. 30 Ocak – 2 Mart 2026 tarihleri arasında başvuru yapılabilir. Projelere 1.500.000 TL'ye varan destek sağlanmaktadır.",
    date: "2026-02-20",
    image_url: "",
    href: "https://www.dortyol.bel.tr/tubitak-bilim-senlikleri-programi-duyurusu",
  },
  {
    id: 103,
    tip: "etkinlik",
    title: "19 Mayıs Gençlik Haftası Etkinlikleri",
    summary: "Motor etkinliği, THM konseri ve Pop Müziği Grubu performansı — Dörttaş Sahil Kenarı.",
    content:
      "19 Mayıs Gençlik Haftası kapsamında Dörttaş Sahil Kenarı'nda etkinlikler düzenlenmiştir. Saat 10.00'da 'Motorları Maviliklere Süreceğiz' etkinliği, 19.30'da THM konseri ve Dörtyol Belediyesi Pop Müziği Grubu sahne almıştır.",
    date: "2025-05-23",
    image_url: "",
    href: "https://www.dortyol.bel.tr/19-mayis-genclik-haftasi-etkinliklerimize-davetlisiniz",
  },
  {
    id: 104,
    tip: "etkinlik",
    title: "İlk Kurşun Kültür-Sanat ve Turunçgil Festivali",
    summary: "Dörtyol'un geleneksel turunçgil festivali; kültür, sanat ve yerel lezzetler bir arada.",
    content:
      "Dörtyol'un simge etkinliklerinden İlk Kurşun Kültür-Sanat ve Turunçgil Festivali, ilçemizin turunçgil üretimi ve kültürel mirasını tanıtmayı amaçlamaktadır. Konserler, sergiler ve yerel ürün stantları düzenlenmektedir.",
    date: "2025-12-16",
    image_url: "",
    href: "https://www.dortyol.bel.tr/dortyol-festivali",
  },
  {
    id: 105,
    tip: "etkinlik",
    title: "9 Ocak Dörtyol'un Kurtuluş Günü",
    summary: "Dörtyol'un düşman işgalinden kurtuluşunun 104. yıl dönümü kutlama etkinlikleri.",
    content:
      "9 Ocak, Dörtyol'un düşman işgalinden kurtuluşunun yıl dönümüdür. Belediyemiz her yıl anma törenleri, resmi programlar ve çeşitli etkinliklerle bu anlamlı günü kutlamaktadır.",
    date: "2026-01-09",
    image_url: "",
    href: "https://www.dortyol.bel.tr",
  },
  {
    id: 106,
    tip: "etkinlik",
    title: "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı",
    summary: "Çocuklarımız için şenlikler, gösteriler ve kutlama programları.",
    content:
      "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı'nda Dörtyol Belediyesi, çocuklarımız için özel etkinlikler, gösteriler ve şenlikler düzenlemektedir.",
    date: "2026-04-23",
    image_url: "",
    href: "https://www.dortyol.bel.tr",
  },
  {
    id: 107,
    tip: "etkinlik",
    title: "Milli Mücadele'de İlk Kurşun'un Atılışı",
    summary: "Kara Mehmet Efe'nin düşmana attığı ilk kurşunun yıl dönümü anma etkinlikleri.",
    content:
      "Milli Mücadele'de İlk Kurşun'un atılışının yıl dönümünde Dörtyol Belediyesi anma törenleri düzenlemektedir. Kara Mehmet Efe'nin kahramanlığı bu etkinliklerle anılmaktadır.",
    date: "2026-02-16",
    image_url: "",
    href: "https://www.dortyol.bel.tr",
  },
  {
    id: 108,
    tip: "etkinlik",
    title: "Ramazan Ayı Etkinlikleri",
    summary: "Hoş geldin ey şehr-i Ramazan — iftar programları ve kültürel etkinlikler.",
    content:
      "Ramazan ayında Dörtyol Belediyesi, vatandaşlarımıza yönelik iftar programları, kültürel etkinlikler ve sosyal yardım organizasyonları düzenlemektedir.",
    date: "2026-03-01",
    image_url: "",
    href: "https://www.dortyol.bel.tr",
  },
  {
    id: 109,
    tip: "etkinlik",
    title: "Kurban Bayramı Kutlaması",
    summary: "Sevdiklerinizle birlikte mutlu, sağlıklı ve huzurlu bir bayram dileğiyle.",
    content:
      "Kurban Bayramı'nda Dörtyol Belediyesi, bayramlaşma programları ve vatandaşlarımıza yönelik hizmetlerle bayram sevincini paylaşmaktadır.",
    date: "2026-06-06",
    image_url: "",
    href: "https://www.dortyol.bel.tr",
  },
  {
    id: 110,
    tip: "etkinlik",
    title: "Anneler Günü Kutlaması",
    summary: "Belediye Başkanı Dr. Bahadır Amaç'tan tüm annelerimize özel mesaj ve etkinlikler.",
    content:
      "Anneler Günü'nde Dörtyol Belediyesi Başkanı Dr. Bahadır Amaç, tüm annelerimizi kutlayarak özel bir mesaj yayımlamıştır.",
    date: "2026-05-10",
    image_url: "",
    href: "https://www.dortyol.bel.tr",
  },
];

export function getIcerikByTip(tip: string): Icerik[] {
  const map: Record<string, IcerikSeed[]> = {
    proje: PROJELER,
    etkinlik: ETKINLIKLER,
  };
  const list = map[tip] || [];
  return list.map((item) => ({ ...item, active: item.active ?? 1 }));
}
