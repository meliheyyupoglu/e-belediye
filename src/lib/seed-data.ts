import { DEPARTMANLAR, DURUMLAR } from "./constants";
import { MAHALLE_NOKTALARI } from "./harita";
import type { Client } from "@libsql/client/web";
import type { Basvuru, Randevu, KesintiBolgesi } from "./db";

export const DEMO_MARKER = "demo_seed";

const ISIMLER = [
  "Ahmet Yılmaz", "Ayşe Demir", "Mehmet Kaya", "Fatma Çelik", "Mustafa Öztürk",
  "Zeynep Arslan", "Ali Şahin", "Emine Koç", "Hasan Aydın", "Elif Yıldız",
  "Burak Polat", "Selin Acar", "Oğuz Güneş", "Deniz Kara", "Cem Erdoğan",
  "Merve Taş", "Kerem Uçar", "Seda Bulut", "Tolga Akın", "Gizem Tunç",
  "Hüseyin Çakır", "Esra Yavuz", "Volkan Tekin", "Dilara Koçak",
];

const DILEK_KONULARI = [
  "Dilek ve Öneri",
  "Şikayet Bildirimi",
  "Bilgi Talebi",
  "Teşekkür",
  "Park düzenlemesi talebi",
  "Temizlik hizmeti şikayeti",
  "Gürültü şikayeti",
  "İmar durumu sorgusu",
  "Sokak aydınlatması talebi",
  "Çöp toplama saati değişikliği",
  "Otopark talebi",
  "Ağaç budama isteği",
];

const DETAY_ORNEKLERI: Record<string, string[]> = {
  su_kesintisi: [
    "Sabah 06:00'dan beri evimize su gelmiyor, acil müdahale rica ederiz.",
    "Ana boru patlaması nedeniyle mahallemizde su kesintisi yaşanıyor.",
    "Su basıncı çok düşük, üst katlara su çıkmıyor.",
    "Planlı kesinti duyurusu yapılmadan su kesildi.",
    "Sokak başındaki vanadan sürekli su akıyor, israf oluşuyor.",
    "Kanalizasyon kokusu su hattına karışıyor olabilir.",
  ],
  elektrik: [
    "Gece yarısından beri mahallemizde elektrik yok.",
    "Sokak lambaları 3 gündür yanmıyor, güvenlik sorunu var.",
    "Trafo arızası nedeniyle 40 haneyi etkileyen kesinti var.",
    "Kablo yer altından duman çıkıyor, yangın riski var.",
    "İş yeri önündeki direk eğilmiş, devrilme tehlikesi.",
    "Gece aydınlatması yetersiz, kaza olabilir.",
  ],
  bozuk_yol: [
    "İstiklal Caddesi üzerinde 40 cm derinliğinde çukur var.",
    "Asfalt dökülmesi nedeniyle trafik tek şeritten akıyor.",
    "Kaldırım taşları kırık, yaşlı vatandaşlar yürüyemiyor.",
    "Yağmur sonrası yol su birikintisi ile kaplanıyor.",
    "Okul yolunda çukur var, öğrenciler için tehlikeli.",
    "Bordür taşları yola kaymış, araç lastiği patlatıyor.",
  ],
  dilek: [
    "Mahallemize çocuk oyun parkı yapılmasını talep ediyoruz.",
    "Toplu taşıma sefer sayısının artırılmasını istiyoruz.",
    "Sokak hayvanları için barınak ve mama noktası talebi.",
    "Belediye hizmetleri hakkında detaylı bilgi almak istiyorum.",
    "Pazar yerine otopark düzenlemesi yapılmalı.",
    "Mahalle içi hız kesici kasis talep ediyoruz.",
  ],
};

function randomItem<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomTc(seed: number): string {
  return String(10000000000 + (seed * 7919) % 89999999999).slice(0, 11);
}

function randomPhone(seed: number): string {
  return `053${String(10000000 + (seed * 3571) % 89999999).slice(0, 8)}`;
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().replace("T", " ").slice(0, 19);
}

function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function mahalleKoordinati(index: number) {
  const m = MAHALLE_NOKTALARI[index % MAHALLE_NOKTALARI.length];
  const jitter = (index % 7) * 0.0012;
  return {
    mahalle: m.ad,
    lat: m.lat + jitter,
    lng: m.lng - jitter * 0.8,
    adres: `${m.ad} Mahallesi Dörtyol Hatay`,
  };
}

/** Bellek / demo için başvuru listesi üretir (~72 kayıt) */
export function generateDemoBasvurular(): Basvuru[] {
  const list: Basvuru[] = [];
  let id = 1;
  let seed = 1;

  const haritaTipleri = [
    { tip: "su_kesintisi", departman: "Su ve Kanalizasyon İşleri", konu: "Su Kesintisi Bildirimi" },
    { tip: "elektrik", departman: "Fen İşleri Müdürlüğü", konu: "Elektrik Arızası Bildirimi" },
    { tip: "bozuk_yol", departman: "Fen İşleri Müdürlüğü", konu: "Bozuk Yol Bildirimi" },
  ] as const;

  const DURUM_DAGILIM: string[] = [
    ...Array(8).fill("İncelemede"),
    ...Array(6).fill("Devam Ediyor"),
    ...Array(4).fill("Çözüldü"),
  ];

  for (const ht of haritaTipleri) {
    for (let i = 0; i < 20; i++) {
      const loc = mahalleKoordinati(seed);
      list.push({
        id: id++,
        tc_no: randomTc(seed),
        ad_soyad: ISIMLER[seed % ISIMLER.length],
        telefon: randomPhone(seed),
        email: `vatandas${seed}@ornek.com`,
        departman: ht.departman,
        konu: ht.konu,
        detay: DETAY_ORNEKLERI[ht.tip][i % DETAY_ORNEKLERI[ht.tip].length],
        durum: DURUM_DAGILIM[i % DURUM_DAGILIM.length],
        notlar: i % 5 === 0 ? "Ekip yönlendirildi." : "",
        belge_dosya: "",
        belge_url: "",
        tarih: daysAgo((seed % 28) + 1),
        basvuru_tipi: ht.tip,
        lat: loc.lat,
        lng: loc.lng,
        adres: loc.adres,
        cadde_sokak: `${loc.mahalle} Cd.`,
        atanan: i % 4 === 0 ? "Fen İşleri Ekibi" : "",
        ic_not: DEMO_MARKER,
      });
      seed++;
    }
  }

  for (let i = 0; i < 20; i++) {
    const loc = mahalleKoordinati(seed);
    list.push({
      id: id++,
      tc_no: randomTc(seed),
      ad_soyad: ISIMLER[seed % ISIMLER.length],
      telefon: randomPhone(seed),
      email: `dilek${seed}@ornek.com`,
      departman: DEPARTMANLAR[seed % DEPARTMANLAR.length],
      konu: DILEK_KONULARI[i % DILEK_KONULARI.length],
      detay: DETAY_ORNEKLERI.dilek[i % DETAY_ORNEKLERI.dilek.length],
      durum: randomItem(DURUMLAR),
      notlar: "",
      belge_dosya: "",
      belge_url: "",
      tarih: daysAgo((seed % 22) + 2),
      basvuru_tipi: "",
      lat: loc.lat,
      lng: loc.lng,
      adres: loc.adres,
      cadde_sokak: "",
      atanan: "",
      ic_not: DEMO_MARKER,
    });
    seed++;
  }

  return list;
}

export function generateDemoRandevular(): Randevu[] {
  const saatler = ["09:00", "09:30", "10:00", "11:00", "13:30", "14:00", "15:00", "16:00"];
  const durumlar = ["Beklemede", "Beklemede", "Beklemede", "Onaylandı", "Tamamlandı", "İptal"];
  const list: Randevu[] = [];

  for (let i = 0; i < 20; i++) {
    list.push({
      id: i + 1,
      tc_no: randomTc(200 + i),
      ad_soyad: ISIMLER[i % ISIMLER.length],
      telefon: randomPhone(200 + i),
      email: `randevu${i}@ornek.com`,
      departman: DEPARTMANLAR[i % DEPARTMANLAR.length],
      konu: i % 2 === 0 ? "Başvuru görüşmesi" : "Bilgi alma randevusu",
      randevu_tarihi: daysFromNow((i % 14) - 2),
      randevu_saati: saatler[i % saatler.length],
      durum: durumlar[i % durumlar.length],
      notlar: DEMO_MARKER,
      olusturma: daysAgo(i % 12),
    });
  }

  return list;
}

export function generateDemoKesintiler(): KesintiBolgesi[] {
  return [
    { id: 1, tip: "su_kesintisi", mahalle: "Numune Evler", aciklama: "Planlı su kesintisi - bakım", lat: 36.8395, lng: 36.218, aktif: 1 },
    { id: 2, tip: "su_kesintisi", mahalle: "Yeni Camii", aciklama: "Ana hat onarımı", lat: 36.841, lng: 36.214, aktif: 1 },
    { id: 3, tip: "elektrik", mahalle: "Altınçağ", aciklama: "Trafo bakımı", lat: 36.835, lng: 36.222, aktif: 1 },
  ];
}

/** Turso'ya demo veri yazar (tablo boşsa) */
export async function seedDemoDataTurso(db: Client): Promise<void> {
  const countRes = await db.execute("SELECT COUNT(*) as c FROM basvurular");
  const total = Number(countRes.rows[0]?.c ?? 0);
  if (total > 0) return;

  for (const b of generateDemoBasvurular()) {
    await db.execute({
      sql: `INSERT INTO basvurular (
        tc_no, ad_soyad, telefon, email, departman, konu, detay, durum, notlar,
        belge_dosya, belge_url, tarih, basvuru_tipi, lat, lng, adres, cadde_sokak, ic_not
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        b.tc_no, b.ad_soyad, b.telefon, b.email || "", b.departman, b.konu, b.detay,
        b.durum, b.notlar, b.belge_dosya, b.belge_url || "", b.tarih,
        b.basvuru_tipi || "", b.lat ?? null, b.lng ?? null,
        b.adres || "", b.cadde_sokak || "", b.ic_not || DEMO_MARKER,
      ],
    });
  }

  const randevuCount = await db.execute("SELECT COUNT(*) as c FROM randevular");
  const rTotal = Number(randevuCount.rows[0]?.c ?? 0);
  if (rTotal === 0) {
    for (const r of generateDemoRandevular()) {
      await db.execute({
        sql: `INSERT INTO randevular (
          tc_no, ad_soyad, telefon, email, departman, konu, randevu_tarihi, randevu_saati, durum, notlar, olusturma
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          r.tc_no, r.ad_soyad, r.telefon, r.email || "", r.departman, r.konu,
          r.randevu_tarihi, r.randevu_saati, r.durum, r.notlar, r.olusturma,
        ],
      });
    }
  }
}
