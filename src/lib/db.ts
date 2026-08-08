import { createClient, type Client } from "@libsql/client/web";
import { SEED_DUYURULAR } from "./announcements";

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

export async function initDb(): Promise<boolean> {
  if (_initialized) return isDbConfigured() && !_initFailed;
  _initialized = true;

  const db = getDb();
  if (!db) return false;

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

    return true;
  } catch (e) {
    console.error("DB init hatası:", e);
    _initFailed = true;
    return false;
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
  if (!(await initDb())) throw new Error("Veritabanı yapılandırılmamış. TURSO_DATABASE_URL ayarlayın.");
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
  if (!(await initDb())) return [];
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
  if (!(await initDb())) return null;
  const db = getDb()!;
  const r = await db.execute({ sql: "SELECT * FROM basvurular WHERE id = ?", args: [id] });
  if (r.rows.length === 0) return null;
  return r.rows[0] as unknown as Basvuru;
}

export async function basvuruDurumGuncelle(id: number, durum: string, notlar: string): Promise<boolean> {
  if (!(await initDb())) return false;
  const db = getDb()!;
  const r = await db.execute({
    sql: "UPDATE basvurular SET durum = ?, notlar = ? WHERE id = ?",
    args: [durum, notlar, id],
  });
  return r.rowsAffected > 0;
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
