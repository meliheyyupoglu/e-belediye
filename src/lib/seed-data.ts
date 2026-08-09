import type { Client } from "@libsql/client/web";
import { DEPARTMANLAR, DURUMLAR } from "./constants";
import { MAHALLE_NOKTALARI } from "./harita";

const DEMO_MARKER = "demo_seed";

const ISIMLER = [
  "Ahmet Yılmaz", "Ayşe Demir", "Mehmet Kaya", "Fatma Çelik", "Mustafa Öztürk",
  "Zeynep Arslan", "Ali Şahin", "Emine Koç", "Hasan Aydın", "Elif Yıldız",
  "Burak Polat", "Selin Acar", "Oğuz Güneş", "Deniz Kara", "Cem Erdoğan",
  "Merve Taş", "Kerem Uçar", "Seda Bulut", "Tolga Akın", "Gizem Tunç",
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
];

const DETAY_ORNEKLERI: Record<string, string[]> = {
  su_kesintisi: [
    "Sabah saatlerinden beri su gelmiyor.",
    "Ana boru patlaması nedeniyle kesinti var.",
    "Basınç çok düşük, su akmıyor.",
    "Mahalle genelinde planlı kesinti duyurulmamış.",
  ],
  elektrik: [
    "Gece yarısından beri elektrik yok.",
    "Sokak lambası yanmıyor.",
    "Trafo arızası var, mahalle etkileniyor.",
    "Kısa devre nedeniyle sigorta atıyor.",
  ],
  bozuk_yol: [
    "Yolda derin çukur oluştu, araçlar zarar görüyor.",
    "Asfalt dökülmesi var, trafik yavaşladı.",
    "Kaldırım taşları kırık, yayalar risk altında.",
    "Yağmur sonrası yol çamur içinde kaldı.",
  ],
  dilek: [
    "Mahallemize yeşil alan yapılmasını talep ediyorum.",
    "Toplu taşıma sefer sayısının artırılmasını istiyorum.",
    "Sokak köpekleri için barınak talebimiz var.",
    "Belediye hizmetleri hakkında bilgi almak istiyorum.",
  ],
};

function rowGet(row: unknown, key: string): unknown {
  return (row as Record<string, unknown>)[key];
}

function randomItem<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomTc(seed: number): string {
  const base = String(10000000000 + (seed * 7919) % 89999999999);
  return base.slice(0, 11);
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

export async function seedDemoData(db: Client): Promise<void> {
  const check = await db.execute({
    sql: "SELECT COUNT(*) as c FROM basvurular WHERE ic_not = ?",
    args: [DEMO_MARKER],
  });
  if (Number(rowGet(check.rows[0], "c") ?? 0) > 0) return;

  let seed = 1;

  const haritaTipleri = [
    { tip: "su_kesintisi", departman: "Su ve Kanalizasyon İşleri", konu: "Su Kesintisi Bildirimi" },
    { tip: "elektrik", departman: "Fen İşleri Müdürlüğü", konu: "Elektrik Arızası Bildirimi" },
    { tip: "bozuk_yol", departman: "Fen İşleri Müdürlüğü", konu: "Bozuk Yol Bildirimi" },
  ] as const;

  for (const ht of haritaTipleri) {
    for (let i = 0; i < 18; i++) {
      const loc = mahalleKoordinati(seed);
      const name = ISIMLER[seed % ISIMLER.length];
      await db.execute({
        sql: `INSERT INTO basvurular (
          tc_no, ad_soyad, telefon, email, departman, konu, detay, durum, notlar,
          belge_dosya, belge_url, tarih, basvuru_tipi, lat, lng, adres, cadde_sokak, ic_not
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, '', '', '', ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          randomTc(seed),
          name,
          randomPhone(seed),
          `vatandas${seed}@ornek.com`,
          ht.departman,
          ht.konu,
          randomItem(DETAY_ORNEKLERI[ht.tip]),
          randomItem(DURUMLAR),
          daysAgo((seed % 25) + 1),
          ht.tip,
          loc.lat,
          loc.lng,
          loc.adres,
          `${loc.mahalle} Cd.`,
          DEMO_MARKER,
        ],
      });
      seed++;
    }
  }

  for (let i = 0; i < 18; i++) {
    const loc = mahalleKoordinati(seed);
    const name = ISIMLER[seed % ISIMLER.length];
    const konu = randomItem(DILEK_KONULARI);
    await db.execute({
      sql: `INSERT INTO basvurular (
        tc_no, ad_soyad, telefon, email, departman, konu, detay, durum, notlar,
        belge_dosya, belge_url, tarih, basvuru_tipi, lat, lng, adres, cadde_sokak, ic_not
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, '', '', '', ?, '', ?, ?, ?, '', ?)`,
      args: [
        randomTc(seed),
        name,
        randomPhone(seed),
        `dilek${seed}@ornek.com`,
        randomItem(DEPARTMANLAR),
        konu,
        randomItem(DETAY_ORNEKLERI.dilek),
        randomItem(DURUMLAR),
        daysAgo((seed % 20) + 2),
        loc.lat,
        loc.lng,
        loc.adres,
        DEMO_MARKER,
      ],
    });
    seed++;
  }

  const randevuCheck = await db.execute({
    sql: "SELECT COUNT(*) as c FROM randevular WHERE notlar = ?",
    args: [DEMO_MARKER],
  });
  if (Number(rowGet(randevuCheck.rows[0], "c") ?? 0) === 0) {
    const saatler = ["09:00", "09:30", "10:00", "11:00", "13:30", "14:00", "15:00", "16:00"];
    for (let i = 0; i < 18; i++) {
      const name = ISIMLER[i % ISIMLER.length];
      await db.execute({
        sql: `INSERT INTO randevular (
          tc_no, ad_soyad, telefon, email, departman, konu, randevu_tarihi, randevu_saati, durum, notlar, olusturma
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          randomTc(100 + i),
          name,
          randomPhone(100 + i),
          `randevu${i}@ornek.com`,
          randomItem(DEPARTMANLAR),
          i % 2 === 0 ? "Başvuru görüşmesi" : "Bilgi alma randevusu",
          daysFromNow((i % 14) - 3),
          randomItem(saatler),
          randomItem(["Beklemede", "Onaylandı", "Tamamlandı", "İptal"]),
          DEMO_MARKER,
          daysAgo(i % 10),
        ],
      });
    }
  }
}
