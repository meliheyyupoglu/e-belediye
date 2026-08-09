import { createClient, type Client } from "@libsql/client/web";
import { SEED_DUYURULAR } from "./announcements";
import {
  memoryBasvuruEkle,
  memoryBasvuruGecmisi,
  memoryBasvuruGetir,
  memoryBasvuruGuncelle,
  memoryBasvurulariGetir,
  memoryCaddeSikayetSayisi,
  memoryKesintileriGetir,
  memoryRandevuEkle,
  memoryRandevulariGetir,
} from "./memory-store";
import { seedDemoDataTurso } from "./seed-data";

let _db: Client | null = null;
let _initialized = false;
let _initFailed = false;

function rowGet(row: unknown, key: string): unknown {
  return (row as Record<string, unknown>)[key];
}

export function isDbConfigured(): boolean {
  return Boolean(process.env.TURSO_DATABASE_URL);
}

function getDb(): Client | null {
  if (_initFailed) return null;
  if (!isDbConfigured()) return null;

  if (!_db) {
    try {
      _db = createClient({
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN,
      });
    } catch (e) {
      console.error("DB client oluşturulamadı:", e);
      _initFailed = true;
      return null;
    }
  }
  return _db;
}

function useMemory(): boolean {
  return !getDb();
}

export async function initDb(): Promise<boolean> {
  if (_initialized) return true;
  _initialized = true;

  const db = getDb();
  if (!db) return true;

  try {
    await db.execute(`CREATE TABLE IF NOT EXISTS basvurular (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tc_no TEXT NOT NULL, ad_soyad TEXT NOT NULL, telefon TEXT NOT NULL,
      email TEXT DEFAULT '', departman TEXT NOT NULL, konu TEXT NOT NULL,
      detay TEXT NOT NULL, durum TEXT NOT NULL DEFAULT 'İncelemede',
      notlar TEXT DEFAULT '', belge_dosya TEXT DEFAULT '', belge_url TEXT DEFAULT '',
      tarih TEXT NOT NULL
    )`);
    await db.execute(`CREATE TABLE IF NOT EXISTS duyurular (
      id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, summary TEXT NOT NULL,
      content TEXT DEFAULT '', date TEXT NOT NULL, category TEXT NOT NULL DEFAULT 'duyuru',
      href TEXT DEFAULT '', active INTEGER DEFAULT 1
    )`);
    await db.execute(`CREATE TABLE IF NOT EXISTS iletisim_mesajlari (
      id INTEGER PRIMARY KEY AUTOINCREMENT, ad_soyad TEXT NOT NULL, email TEXT NOT NULL,
      telefon TEXT DEFAULT '', konu TEXT NOT NULL, mesaj TEXT NOT NULL, tarih TEXT NOT NULL
    )`);

    const count = await db.execute("SELECT COUNT(*) as c FROM duyurular");
    const n = Number(rowGet(count.rows[0], "c") ?? 0);
    if (n === 0) {
      for (const d of SEED_DUYURULAR) {
        await db.execute({
          sql: `INSERT INTO duyurular (title, summary, content, date, category, href, active)
                VALUES (?, ?, ?, ?, ?, ?, 1)`,
          args: [d.title, d.summary, d.content || d.summary, d.date, d.category, d.href || ""],
        });
      }
    }

    // email kolonu migration
    const cols = await db.execute("PRAGMA table_info(basvurular)");
    const colNames = cols.rows.map((r) => String(rowGet(r, "name") ?? ""));
    if (!colNames.includes("email")) {
      await db.execute("ALTER TABLE basvurular ADD COLUMN email TEXT DEFAULT ''");
    }
    if (!colNames.includes("belge_url")) {
      await db.execute("ALTER TABLE basvurular ADD COLUMN belge_url TEXT DEFAULT ''");
    }
    if (!colNames.includes("basvuru_tipi")) {
      await db.execute("ALTER TABLE basvurular ADD COLUMN basvuru_tipi TEXT DEFAULT ''");
    }
    if (!colNames.includes("lat")) {
      await db.execute("ALTER TABLE basvurular ADD COLUMN lat REAL");
    }
    if (!colNames.includes("lng")) {
      await db.execute("ALTER TABLE basvurular ADD COLUMN lng REAL");
    }
    if (!colNames.includes("adres")) {
      await db.execute("ALTER TABLE basvurular ADD COLUMN adres TEXT DEFAULT ''");
    }
    if (!colNames.includes("cadde_sokak")) {
      await db.execute("ALTER TABLE basvurular ADD COLUMN cadde_sokak TEXT DEFAULT ''");
    }
    if (!colNames.includes("atanan")) {
      await db.execute("ALTER TABLE basvurular ADD COLUMN atanan TEXT DEFAULT ''");
    }
    if (!colNames.includes("ic_not")) {
      await db.execute("ALTER TABLE basvurular ADD COLUMN ic_not TEXT DEFAULT ''");
    }

    await db.execute(`CREATE TABLE IF NOT EXISTS randevular (
      id INTEGER PRIMARY KEY AUTOINCREMENT, tc_no TEXT NOT NULL, ad_soyad TEXT NOT NULL,
      telefon TEXT NOT NULL, email TEXT DEFAULT '', departman TEXT NOT NULL, konu TEXT NOT NULL,
      randevu_tarihi TEXT NOT NULL, randevu_saati TEXT NOT NULL,
      durum TEXT NOT NULL DEFAULT 'Beklemede', notlar TEXT DEFAULT '', olusturma TEXT NOT NULL
    )`);
    await db.execute(`CREATE TABLE IF NOT EXISTS otp_kodlari (
      id INTEGER PRIMARY KEY AUTOINCREMENT, hedef TEXT NOT NULL, kod TEXT NOT NULL,
      tip TEXT NOT NULL, olusturma TEXT NOT NULL, kullanildi INTEGER DEFAULT 0
    )`);
    await db.execute(`CREATE TABLE IF NOT EXISTS kesinti_bolgeleri (
      id INTEGER PRIMARY KEY AUTOINCREMENT, tip TEXT NOT NULL, mahalle TEXT NOT NULL,
      aciklama TEXT DEFAULT '', lat REAL NOT NULL, lng REAL NOT NULL, aktif INTEGER DEFAULT 1
    )`);
    await db.execute(`CREATE TABLE IF NOT EXISTS icerikler (
      id INTEGER PRIMARY KEY AUTOINCREMENT, tip TEXT NOT NULL, title TEXT NOT NULL,
      summary TEXT NOT NULL, content TEXT DEFAULT '', date TEXT NOT NULL,
      image_url TEXT DEFAULT '', active INTEGER DEFAULT 1
    )`);
    await db.execute(`CREATE TABLE IF NOT EXISTS abonelikler (
      id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE, tarih TEXT NOT NULL
    )`);

    const kesintiCount = await db.execute("SELECT COUNT(*) as c FROM kesinti_bolgeleri");
    if (Number(rowGet(kesintiCount.rows[0], "c") ?? 0) === 0) {
      const kesintiler = [
        ["su_kesintisi", "Numune Evler Mahallesi", "Planlı su kesintisi - bakım çalışması", 36.8395, 36.2180],
        ["su_kesintisi", "Yeni Camii Mahallesi", "Ana hat onarımı", 36.8410, 36.2140],
      ];
      for (const k of kesintiler) {
        await db.execute({
          sql: `INSERT INTO kesinti_bolgeleri (tip, mahalle, aciklama, lat, lng, aktif) VALUES (?, ?, ?, ?, ?, 1)`,
          args: k as (string | number)[],
        });
      }
    }

    const icerikCount = await db.execute("SELECT COUNT(*) as c FROM icerikler");
    if (Number(rowGet(icerikCount.rows[0], "c") ?? 0) === 0) {
      const icerikler = [
        ["proje", "Kentsel Dönüşüm Projesi", "Dörtyol merkez mahallelerinde kentsel dönüşüm çalışmaları devam ediyor.", "2026-01-15"],
        ["proje", "Sahil Düzenleme Projesi", "Sahil bandında yürüyüş yolu ve aydınlatma çalışmaları.", "2026-02-01"],
        ["etkinlik", "23 Nisan Kutlaması", "Çocuk şenlikleri ve konser etkinlikleri.", "2026-04-23"],
        ["etkinlik", "Yaz Konserleri", "Açık hava yaz konser serisi.", "2026-07-10"],
        ["basin", "2026 Yatırım Programı Açıklandı", "Belediyemiz 2026 yatırım programını duyurdu.", "2026-01-10"],
        ["basin", "Yol Yapım Çalışmaları Başladı", "Fen İşleri ekipleri asfalt yenileme çalışmalarına başladı.", "2026-03-05"],
      ];
      for (const ic of icerikler) {
        await db.execute({
          sql: `INSERT INTO icerikler (tip, title, summary, content, date, active) VALUES (?, ?, ?, ?, ?, 1)`,
          args: [ic[0], ic[1], ic[2], ic[2], ic[3]],
        });
      }
    }

    await seedDemoDataTurso(db);

    return true;
  } catch (e) {
    console.error("DB init hatası:", e);
    _initFailed = true;
    return true;
  }
}

export interface Basvuru {
  id: number;
  tc_no: string;
  ad_soyad: string;
  telefon: string;
  email?: string;
  departman: string;
  konu: string;
  detay: string;
  durum: string;
  notlar: string;
  belge_dosya: string;
  belge_url?: string;
  tarih: string;
  basvuru_tipi?: string;
  lat?: number | null;
  lng?: number | null;
  adres?: string;
  cadde_sokak?: string;
  atanan?: string;
  ic_not?: string;
}

export interface Duyuru {
  id: number;
  title: string;
  summary: string;
  content: string;
  date: string;
  category: string;
  href: string;
  active: number;
}

export interface IletisimMesaji {
  id: number;
  ad_soyad: string;
  email: string;
  telefon: string;
  konu: string;
  mesaj: string;
  tarih: string;
}

export interface Randevu {
  id: number;
  tc_no: string;
  ad_soyad: string;
  telefon: string;
  email?: string;
  departman: string;
  konu: string;
  randevu_tarihi: string;
  randevu_saati: string;
  durum: string;
  notlar: string;
  olusturma: string;
}

export interface KesintiBolgesi {
  id: number;
  tip: string;
  mahalle: string;
  aciklama: string;
  lat: number;
  lng: number;
  aktif: number;
}

export interface Icerik {
  id: number;
  tip: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  image_url: string;
  active: number;
}

const EMPTY_STATS = { toplam: 0, incelemede: 0, devam: 0, cozuldu: 0 };

export async function basvuruEkle(data: {
  tc_no: string;
  ad_soyad: string;
  telefon: string;
  email?: string;
  departman: string;
  konu: string;
  detay: string;
  belge_dosya?: string;
  belge_url?: string;
  basvuru_tipi?: string;
  lat?: number | null;
  lng?: number | null;
  adres?: string;
  cadde_sokak?: string;
}): Promise<number> {
  await initDb();
  if (useMemory()) return memoryBasvuruEkle(data);
  const db = getDb()!;
  const tarih = new Date().toISOString().replace("T", " ").slice(0, 19);
  const result = await db.execute({
    sql: `INSERT INTO basvurular (
            tc_no, ad_soyad, telefon, email, departman, konu, detay, durum, notlar,
            belge_dosya, belge_url, tarih, basvuru_tipi, lat, lng, adres, cadde_sokak
          ) VALUES (?, ?, ?, ?, ?, ?, ?, 'İncelemede', '', ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      data.tc_no, data.ad_soyad, data.telefon, data.email || "",
      data.departman, data.konu, data.detay,
      data.belge_dosya || "", data.belge_url || "", tarih,
      data.basvuru_tipi || "",
      data.lat ?? null, data.lng ?? null,
      data.adres || "", data.cadde_sokak || "",
    ],
  });
  return Number(result.lastInsertRowid);
}

export async function tumBasvurulariGetir(departman?: string): Promise<Basvuru[]> {
  await initDb();
  if (useMemory()) return memoryBasvurulariGetir(departman);
  const db = getDb()!;
  if (departman && departman !== "Tümü") {
    const r = await db.execute({
      sql: "SELECT * FROM basvurular WHERE departman = ? ORDER BY tarih DESC",
      args: [departman],
    });
    return r.rows as unknown as Basvuru[];
  }
  const r = await db.execute("SELECT * FROM basvurular ORDER BY tarih DESC");
  return r.rows as unknown as Basvuru[];
}

export async function basvuruSorgulaId(id: number): Promise<Basvuru | null> {
  await initDb();
  if (useMemory()) return memoryBasvuruGetir(id);
  const db = getDb()!;
  const r = await db.execute({ sql: "SELECT * FROM basvurular WHERE id = ?", args: [id] });
  if (r.rows.length === 0) return null;
  return r.rows[0] as unknown as Basvuru;
}

export async function basvuruDurumGuncelle(
  id: number,
  durum: string,
  notlar: string,
  atanan?: string,
  ic_not?: string
): Promise<boolean> {
  await initDb();
  if (useMemory()) return memoryBasvuruGuncelle(id, durum, notlar, atanan, ic_not);
  const db = getDb()!;
  const r = await db.execute({
    sql: "UPDATE basvurular SET durum = ?, notlar = ?, atanan = COALESCE(?, atanan), ic_not = COALESCE(?, ic_not) WHERE id = ?",
    args: [durum, notlar, atanan || null, ic_not || null, id],
  });
  return r.rowsAffected > 0;
}

export async function basvuruGecmisiGetir(tc_no: string, telefon: string): Promise<Basvuru[]> {
  await initDb();
  if (useMemory()) return memoryBasvuruGecmisi(tc_no, telefon);
  const db = getDb()!;
  const tel = telefon.replace(/[\s\-()]/g, "");
  const r = await db.execute({
    sql: "SELECT * FROM basvurular WHERE tc_no = ? AND REPLACE(REPLACE(REPLACE(telefon,' ',''),'-',''),'(','') LIKE ? ORDER BY tarih DESC",
    args: [tc_no, `%${tel.slice(-10)}%`],
  });
  return r.rows as unknown as Basvuru[];
}

export async function geoBasvurulariGetir(): Promise<Basvuru[]> {
  const all = await tumBasvurulariGetir();
  return all.filter((b) => b.lat != null && b.lng != null);
}

export async function caddeSikayetSayisi(cadde: string): Promise<number> {
  await initDb();
  if (useMemory()) return memoryCaddeSikayetSayisi(cadde);
  const db = getDb()!;
  const r = await db.execute({
    sql: "SELECT COUNT(*) as c FROM basvurular WHERE basvuru_tipi = 'bozuk_yol' AND (cadde_sokak LIKE ? OR adres LIKE ?)",
    args: [`%${cadde}%`, `%${cadde}%`],
  });
  return Number(rowGet(r.rows[0], "c") ?? 0);
}

export async function otpKaydet(hedef: string, kod: string, tip: string): Promise<void> {
  if (!(await initDb())) return;
  const db = getDb()!;
  const olusturma = new Date().toISOString();
  await db.execute({
    sql: "INSERT INTO otp_kodlari (hedef, kod, tip, olusturma) VALUES (?, ?, ?, ?)",
    args: [hedef, kod, tip, olusturma],
  });
}

export async function otpGecerliMi(hedef: string, kod: string, tip: string): Promise<boolean> {
  if (!(await initDb())) return false;
  const db = getDb()!;
  const r = await db.execute({
    sql: `SELECT * FROM otp_kodlari WHERE hedef = ? AND kod = ? AND tip = ? AND kullanildi = 0
          ORDER BY olusturma DESC LIMIT 1`,
    args: [hedef, kod, tip],
  });
  if (r.rows.length === 0) return false;
  const row = r.rows[0] as unknown as { olusturma: string };
  const age = Date.now() - new Date(row.olusturma).getTime();
  return age <= 10 * 60 * 1000;
}

export async function otpDogrula(hedef: string, kod: string, tip: string): Promise<boolean> {
  if (!(await initDb())) return false;
  const db = getDb()!;
  const r = await db.execute({
    sql: `SELECT * FROM otp_kodlari WHERE hedef = ? AND kod = ? AND tip = ? AND kullanildi = 0
          ORDER BY olusturma DESC LIMIT 1`,
    args: [hedef, kod, tip],
  });
  if (r.rows.length === 0) return false;
  const row = r.rows[0] as unknown as { id: number; olusturma: string };
  const age = Date.now() - new Date(row.olusturma).getTime();
  if (age > 10 * 60 * 1000) return false;
  await db.execute({ sql: "UPDATE otp_kodlari SET kullanildi = 1 WHERE id = ?", args: [row.id] });
  return true;
}

export async function randevuEkle(data: Omit<Randevu, "id" | "durum" | "notlar" | "olusturma">): Promise<number> {
  await initDb();
  if (useMemory()) return memoryRandevuEkle(data);
  const db = getDb()!;
  const olusturma = new Date().toISOString().replace("T", " ").slice(0, 19);
  const r = await db.execute({
    sql: `INSERT INTO randevular (tc_no, ad_soyad, telefon, email, departman, konu, randevu_tarihi, randevu_saati, durum, notlar, olusturma)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Beklemede', '', ?)`,
    args: [data.tc_no, data.ad_soyad, data.telefon, data.email || "", data.departman, data.konu, data.randevu_tarihi, data.randevu_saati, olusturma],
  });
  return Number(r.lastInsertRowid);
}

export async function tumRandevulariGetir(): Promise<Randevu[]> {
  await initDb();
  if (useMemory()) return memoryRandevulariGetir();
  const db = getDb()!;
  const r = await db.execute("SELECT * FROM randevular ORDER BY randevu_tarihi DESC, randevu_saati DESC");
  return r.rows as unknown as Randevu[];
}

export async function kesintiBolgeleriGetir(tip?: string): Promise<KesintiBolgesi[]> {
  await initDb();
  if (useMemory()) return memoryKesintileriGetir(tip);
  const db = getDb()!;
  if (tip) {
    const r = await db.execute({ sql: "SELECT * FROM kesinti_bolgeleri WHERE aktif = 1 AND tip = ?", args: [tip] });
    return r.rows as unknown as KesintiBolgesi[];
  }
  const r = await db.execute("SELECT * FROM kesinti_bolgeleri WHERE aktif = 1");
  return r.rows as unknown as KesintiBolgesi[];
}

export async function icerikleriGetir(tip: string): Promise<Icerik[]> {
  if (!(await initDb())) return [];
  const db = getDb()!;
  const r = await db.execute({
    sql: "SELECT * FROM icerikler WHERE tip = ? AND active = 1 ORDER BY date DESC",
    args: [tip],
  });
  return r.rows as unknown as Icerik[];
}

export async function abonelikEkle(email: string): Promise<boolean> {
  if (!(await initDb())) return false;
  const db = getDb()!;
  try {
    await db.execute({
      sql: "INSERT INTO abonelikler (email, tarih) VALUES (?, ?)",
      args: [email, new Date().toISOString().slice(0, 10)],
    });
    return true;
  } catch {
    return false;
  }
}

export async function tumAbonelikleriGetir(): Promise<string[]> {
  if (!(await initDb())) return [];
  const db = getDb()!;
  const r = await db.execute("SELECT email FROM abonelikler");
  return r.rows.map((row) => String(rowGet(row, "email") ?? ""));
}

export async function getDashboardStats() {
  const basvurular = await tumBasvurulariGetir();
  const randevular = await tumRandevulariGetir();
  const mahalleMap: Record<string, number> = {};
  for (const b of basvurular) {
    if (b.adres) {
      const m = b.adres.split(" ").find((p) => p.includes("Mahalle")) || "Diğer";
      mahalleMap[m] = (mahalleMap[m] || 0) + 1;
    }
  }
  const topMahalle = Object.entries(mahalleMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
  return {
    toplam: basvurular.length,
    incelemede: basvurular.filter((b) => b.durum === "İncelemede").length,
    devam: basvurular.filter((b) => b.durum === "Devam Ediyor").length,
    cozuldu: basvurular.filter((b) => b.durum === "Çözüldü").length,
    harita: basvurular.filter((b) => b.basvuru_tipi).length,
    randevu: randevular.filter((r) => r.durum === "Beklemede").length,
    topMahalle,
    tipDagilim: {
      su: basvurular.filter((b) => b.basvuru_tipi === "su_kesintisi").length,
      elektrik: basvurular.filter((b) => b.basvuru_tipi === "elektrik").length,
      yol: basvurular.filter((b) => b.basvuru_tipi === "bozuk_yol").length,
      dilek: basvurular.filter((b) => !b.basvuru_tipi).length,
    },
  };
}

export async function getStats() {
  const basvurular = await tumBasvurulariGetir();
  return {
    toplam: basvurular.length,
    incelemede: basvurular.filter((b) => b.durum === "İncelemede").length,
    devam: basvurular.filter((b) => b.durum === "Devam Ediyor").length,
    cozuldu: basvurular.filter((b) => b.durum === "Çözüldü").length,
  };
}

export async function tumDuyurulariGetir(): Promise<Duyuru[]> {
  if (!(await initDb())) {
    return SEED_DUYURULAR.map((d, i) => ({
      id: i + 1,
      title: d.title,
      summary: d.summary,
      content: d.content || d.summary,
      date: d.date,
      category: d.category,
      href: d.href || "",
      active: 1,
    }));
  }
  const db = getDb()!;
  const r = await db.execute("SELECT * FROM duyurular WHERE active = 1 ORDER BY date DESC");
  return r.rows as unknown as Duyuru[];
}

export async function duyuruGetir(id: number): Promise<Duyuru | null> {
  if (!(await initDb())) {
    const list = await tumDuyurulariGetir();
    return list.find((d) => d.id === id) || null;
  }
  const db = getDb()!;
  const r = await db.execute({ sql: "SELECT * FROM duyurular WHERE id = ?", args: [id] });
  if (r.rows.length === 0) return null;
  return r.rows[0] as unknown as Duyuru;
}

export async function duyuruEkle(data: Omit<Duyuru, "id" | "active">): Promise<number> {
  if (!(await initDb())) throw new Error("Veritabanı yapılandırılmamış.");
  const db = getDb()!;
  const r = await db.execute({
    sql: `INSERT INTO duyurular (title, summary, content, date, category, href, active)
          VALUES (?, ?, ?, ?, ?, ?, 1)`,
    args: [data.title, data.summary, data.content, data.date, data.category, data.href],
  });
  return Number(r.lastInsertRowid);
}

export async function duyuruGuncelle(id: number, data: Partial<Duyuru>): Promise<boolean> {
  if (!(await initDb())) return false;
  const existing = await duyuruGetir(id);
  if (!existing) return false;

  const db = getDb()!;
  const r = await db.execute({
    sql: `UPDATE duyurular SET title=?, summary=?, content=?, date=?, category=?, href=?, active=?
          WHERE id=?`,
    args: [
      data.title ?? existing.title,
      data.summary ?? existing.summary,
      data.content ?? existing.content,
      data.date ?? existing.date,
      data.category ?? existing.category,
      data.href ?? existing.href,
      data.active ?? existing.active,
      id,
    ],
  });
  return r.rowsAffected > 0;
}

export async function duyuruSil(id: number): Promise<boolean> {
  if (!(await initDb())) return false;
  const db = getDb()!;
  const r = await db.execute({ sql: "UPDATE duyurular SET active = 0 WHERE id = ?", args: [id] });
  return r.rowsAffected > 0;
}

export async function iletisimEkle(data: {
  ad_soyad: string;
  email: string;
  telefon?: string;
  konu: string;
  mesaj: string;
}): Promise<number> {
  if (!(await initDb())) throw new Error("Veritabanı yapılandırılmamış.");
  const db = getDb()!;
  const tarih = new Date().toISOString().replace("T", " ").slice(0, 19);
  const r = await db.execute({
    sql: `INSERT INTO iletisim_mesajlari (ad_soyad, email, telefon, konu, mesaj, tarih)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [data.ad_soyad, data.email, data.telefon || "", data.konu, data.mesaj, tarih],
  });
  return Number(r.lastInsertRowid);
}

export async function tumIletisimMesajlariGetir(): Promise<IletisimMesaji[]> {
  if (!(await initDb())) return [];
  const db = getDb()!;
  const r = await db.execute("SELECT * FROM iletisim_mesajlari ORDER BY tarih DESC");
  return r.rows as unknown as IletisimMesaji[];
}

export { EMPTY_STATS };
