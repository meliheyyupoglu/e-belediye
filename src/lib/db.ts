import { createClient, Client } from "@libsql/client";

let _db: Client | null = null;

export function getDb(): Client {
  if (!_db) {
    const url = process.env.TURSO_DATABASE_URL || "file:belediye.db";
    const authToken = process.env.TURSO_AUTH_TOKEN;
    _db = createClient({
      url,
      authToken: authToken || undefined,
    });
  }
  return _db;
}

let _initialized = false;

export async function initDb(): Promise<void> {
  if (_initialized) return;
  const db = getDb();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS basvurular (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tc_no TEXT NOT NULL,
      ad_soyad TEXT NOT NULL,
      telefon TEXT NOT NULL,
      departman TEXT NOT NULL,
      konu TEXT NOT NULL,
      detay TEXT NOT NULL,
      durum TEXT NOT NULL DEFAULT 'İncelemede',
      notlar TEXT DEFAULT '',
      belge_dosya TEXT DEFAULT '',
      tarih TEXT NOT NULL
    )
  `);
  _initialized = true;
}

export interface Basvuru {
  id: number;
  tc_no: string;
  ad_soyad: string;
  telefon: string;
  departman: string;
  konu: string;
  detay: string;
  durum: string;
  notlar: string;
  belge_dosya: string;
  tarih: string;
}

export async function basvuruEkle(data: {
  tc_no: string;
  ad_soyad: string;
  telefon: string;
  departman: string;
  konu: string;
  detay: string;
  belge_dosya?: string;
}): Promise<number> {
  await initDb();
  const db = getDb();
  const tarih = new Date().toISOString().replace("T", " ").slice(0, 19);
  const result = await db.execute({
    sql: `INSERT INTO basvurular (tc_no, ad_soyad, telefon, departman, konu, detay, durum, notlar, belge_dosya, tarih)
          VALUES (?, ?, ?, ?, ?, ?, 'İncelemede', '', ?, ?)`,
    args: [
      data.tc_no,
      data.ad_soyad,
      data.telefon,
      data.departman,
      data.konu,
      data.detay,
      data.belge_dosya || "",
      tarih,
    ],
  });
  return Number(result.lastInsertRowid);
}

export async function tumBasvurulariGetir(
  departman?: string
): Promise<Basvuru[]> {
  await initDb();
  const db = getDb();
  if (departman && departman !== "Tümü") {
    const result = await db.execute({
      sql: "SELECT * FROM basvurular WHERE departman = ? ORDER BY tarih DESC",
      args: [departman],
    });
    return result.rows as unknown as Basvuru[];
  }
  const result = await db.execute(
    "SELECT * FROM basvurular ORDER BY tarih DESC"
  );
  return result.rows as unknown as Basvuru[];
}

export async function basvuruSorgulaId(id: number): Promise<Basvuru | null> {
  await initDb();
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT * FROM basvurular WHERE id = ?",
    args: [id],
  });
  if (result.rows.length === 0) return null;
  return result.rows[0] as unknown as Basvuru;
}

export async function basvuruDurumGuncelle(
  id: number,
  durum: string,
  notlar: string
): Promise<boolean> {
  await initDb();
  const db = getDb();
  const result = await db.execute({
    sql: "UPDATE basvurular SET durum = ?, notlar = ? WHERE id = ?",
    args: [durum, notlar, id],
  });
  return result.rowsAffected > 0;
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
