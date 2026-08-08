"""SQLite veritabanı işlemleri."""

import sqlite3
from datetime import datetime
from pathlib import Path
from typing import Optional

from config.constants import DB_PATH, DURUMLAR, UPLOAD_DIR


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def _ensure_belge_column(conn: sqlite3.Connection) -> None:
    columns = [row[1] for row in conn.execute("PRAGMA table_info(basvurular)").fetchall()]
    if "belge_dosya" not in columns:
        conn.execute("ALTER TABLE basvurular ADD COLUMN belge_dosya TEXT DEFAULT ''")


def init_db() -> None:
    Path(UPLOAD_DIR).mkdir(exist_ok=True)
    with get_connection() as conn:
        conn.execute(
            """
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
            """
        )
        _ensure_belge_column(conn)
        conn.commit()


def kaydet_belge(basvuru_id: int, uploaded_file) -> str:
    if uploaded_file is None:
        return ""

    upload_path = Path(UPLOAD_DIR)
    upload_path.mkdir(exist_ok=True)
    safe_name = f"{basvuru_id}_{uploaded_file.name}"
    file_path = upload_path / safe_name
    file_path.write_bytes(uploaded_file.getvalue())
    return str(file_path)


def basvuru_ekle(
    tc_no: str,
    ad_soyad: str,
    telefon: str,
    departman: str,
    konu: str,
    detay: str,
    belge_dosya: str = "",
) -> int:
    tarih = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with get_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO basvurular
                (tc_no, ad_soyad, telefon, departman, konu, detay, durum, notlar, belge_dosya, tarih)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (tc_no, ad_soyad, telefon, departman, konu, detay, "İncelemede", "", belge_dosya, tarih),
        )
        conn.commit()
        return cursor.lastrowid


def basvuru_belge_guncelle(basvuru_id: int, belge_dosya: str) -> None:
    with get_connection() as conn:
        conn.execute(
            "UPDATE basvurular SET belge_dosya = ? WHERE id = ?",
            (belge_dosya, basvuru_id),
        )
        conn.commit()


def tum_basvurulari_getir(departman: Optional[str] = None) -> list[dict]:
    query = "SELECT * FROM basvurular"
    params: tuple = ()

    if departman and departman != "Tümü":
        query += " WHERE departman = ?"
        params = (departman,)

    query += " ORDER BY tarih DESC"

    with get_connection() as conn:
        rows = conn.execute(query, params).fetchall()
        return [dict(row) for row in rows]


def basvuru_sorgula_id(basvuru_id: int) -> Optional[dict]:
    with get_connection() as conn:
        row = conn.execute(
            "SELECT * FROM basvurular WHERE id = ?",
            (basvuru_id,),
        ).fetchone()
        return dict(row) if row else None


def basvuru_durum_guncelle(
    basvuru_id: int,
    yeni_durum: str,
    notlar: str = "",
) -> bool:
    if yeni_durum not in DURUMLAR:
        raise ValueError(f"Geçersiz durum: {yeni_durum}")

    with get_connection() as conn:
        cursor = conn.execute(
            """
            UPDATE basvurular
            SET durum = ?, notlar = ?
            WHERE id = ?
            """,
            (yeni_durum, notlar, basvuru_id),
        )
        conn.commit()
        return cursor.rowcount > 0
