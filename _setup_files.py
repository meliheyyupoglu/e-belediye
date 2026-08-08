"""Proje dosyalarini UTF-8 olarak yazar."""
from pathlib import Path

ROOT = Path(__file__).parent

(ROOT / "config").mkdir(exist_ok=True)
(ROOT / ".streamlit").mkdir(exist_ok=True)
(ROOT / "uploads").mkdir(exist_ok=True)

(ROOT / "config" / "constants.py").write_text(
    '''"""Uygulama genelinde kullanılan sabit değerler."""

BELEDIYE_ADI = "T.C. Dörtyol Belediyesi"
SISTEM_ADI = "Vatandaş Başvuru ve Yönetim Sistemi"

DEPARTMANLAR = [
    "Fen İşleri Müdürlüğü",
    "İmar ve Şehircilik Müdürlüğü",
    "Park ve Bahçeler Müdürlüğü",
    "Zabıta Müdürlüğü",
    "Temizlik İşleri Müdürlüğü",
    "Bilgi İşlem Müdürlüğü",
    "Basın Yayın ve Halkla İlişkiler Müdürlüğü",
    "Afet İşleri ve Risk Yönetimi Müdürlüğü",
    "Emlak ve İstimlak Müdürlüğü",
    "Su ve Kanalizasyon İşleri",
    "Kültür Sanat ve Sosyal İşler Müdürlüğü",
    "Destek Hizmetleri Müdürlüğü",
    "Ruhsat ve Denetim Müdürlüğü",
]

DURUMLAR = [
    "İncelemede",
    "Devam Ediyor",
    "Çözüldü",
    "Reddedildi",
]

DB_PATH = "belediye.db"
UPLOAD_DIR = "uploads"

MENU_SECENEKLERI = [
    "Ana Sayfa",
    "Vatandaş Başvuru Yap",
    "Başvuru Sorgula",
    "Müdürlüklerimiz",
    "Belediye Yönetici Paneli",
]
''',
    encoding="utf-8",
)

(ROOT / "config" / "__init__.py").write_text(
    '''from config.constants import (
    BELEDIYE_ADI,
    DEPARTMANLAR,
    DURUMLAR,
    DB_PATH,
    MENU_SECENEKLERI,
    SISTEM_ADI,
    UPLOAD_DIR,
)

__all__ = [
    "BELEDIYE_ADI",
    "DEPARTMANLAR",
    "DURUMLAR",
    "DB_PATH",
    "MENU_SECENEKLERI",
    "SISTEM_ADI",
    "UPLOAD_DIR",
]
''',
    encoding="utf-8",
)

(ROOT / ".streamlit" / "config.toml").write_text(
    '''[theme]
primaryColor = "#0d6efd"
backgroundColor = "#FFFFFF"
secondaryBackgroundColor = "#F8F9FA"
textColor = "#212529"
font = "sans serif"

[server]
headless = true
''',
    encoding="utf-8",
)

(ROOT / "database.py").write_text(
    '''"""SQLite veritabanı işlemleri."""

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
''',
    encoding="utf-8",
)

(ROOT / "app.py").write_text(
    '''"""T.C. Dörtyol Belediyesi Vatandaş Başvuru ve Yönetim Sistemi."""

from pathlib import Path

import pandas as pd
import plotly.express as px
import streamlit as st

from config.constants import (
    BELEDIYE_ADI,
    DEPARTMANLAR,
    DURUMLAR,
    MENU_SECENEKLERI,
    SISTEM_ADI,
)
from config.mudurlukler import BELEDIYE_ILETISIM, MUDURLUK_BILGILERI
from database import (
    basvuru_belge_guncelle,
    basvuru_durum_guncelle,
    basvuru_ekle,
    basvuru_sorgula_id,
    init_db,
    kaydet_belge,
    tum_basvurulari_getir,
)

st.set_page_config(
    page_title=f"{BELEDIYE_ADI} | e-Belediye",
    layout="wide",
    initial_sidebar_state="expanded",
)

st.markdown(
    """
    <style>
        .stApp { background: #FFFFFF; }
        .main-header {
            font-size: 2rem; font-weight: 700; color: #0d6efd; margin-bottom: 0.5rem;
        }
        .hero-card {
            background: linear-gradient(135deg, #0d6efd 0%, #084298 100%);
            color: #fff; padding: 2rem; border-radius: 12px;
            border-left: 6px solid #dc3545; margin-bottom: 1.5rem;
        }
        .hero-card h1 { color: #fff; margin: 0 0 0.5rem 0; font-size: 1.75rem; }
        .hero-card p { color: #e7f1ff; margin: 0; }
        .stat-card {
            background: #F8F9FA; border: 1px solid #dee2e6; border-radius: 10px;
            padding: 1.2rem; text-align: center; border-top: 4px solid #0d6efd;
        }
        .stat-card.green { border-top-color: #198754; }
        .stat-card.orange { border-top-color: #fd7e14; }
        .stat-card.red { border-top-color: #dc3545; }
        .stat-value { font-size: 2rem; font-weight: 700; color: #212529; }
        .stat-label { font-size: 0.9rem; color: #6c757d; }
        .welcome-text {
            background: #F8F9FA; padding: 1.5rem; border-radius: 10px;
            border-left: 4px solid #0d6efd; line-height: 1.7; color: #495057;
        }
        .info-card {
            background: #F8F9FA; border: 1px solid #dee2e6;
            border-radius: 10px; padding: 1.2rem;
        }
        div[data-testid="stSidebar"] {
            background: #FFFFFF; border-right: 1px solid #dee2e6;
        }
        div[data-testid="stSidebar"] .sidebar-title {
            font-size: 1.1rem; font-weight: 700; color: #212529; margin-bottom: 0.25rem;
        }
        div[data-testid="stSidebar"] .sidebar-subtitle {
            font-size: 0.85rem; color: #6c757d; margin-bottom: 1rem;
        }
        div[data-testid="stSidebar"] .menu-label {
            font-size: 0.75rem; font-weight: 600; color: #6c757d;
            text-transform: uppercase; letter-spacing: 0.05em; margin: 1rem 0 0.5rem 0;
        }
        div[data-testid="stSidebar"] div.stButton > button {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            color: #212529 !important;
            text-align: left !important;
            padding: 0.4rem 0 !important;
            font-weight: 400 !important;
            justify-content: flex-start !important;
        }
        div[data-testid="stSidebar"] div.stButton > button:hover {
            color: #0d6efd !important;
            background: transparent !important;
        }
        div[data-testid="stSidebar"] div.stButton > button:focus {
            box-shadow: none !important;
            outline: none !important;
        }
        div[data-testid="stSidebar"] .menu-active div.stButton > button {
            color: #0d6efd !important;
            font-weight: 600 !important;
        }
        .mudurluk-card {
            background: #F8F9FA; border: 1px solid #dee2e6; border-radius: 10px;
            padding: 1.2rem; margin-bottom: 0.5rem; border-left: 4px solid #0d6efd;
            min-height: 120px;
        }
        .mudurluk-card h3 { color: #0d6efd; font-size: 1rem; margin: 0 0 0.5rem 0; }
        .mudurluk-card p { color: #495057; font-size: 0.85rem; margin: 0; line-height: 1.5; }
        .mudurluk-detail-header {
            background: linear-gradient(135deg, #0d6efd 0%, #084298 100%);
            color: #fff; padding: 1.5rem; border-radius: 10px; margin-bottom: 1.5rem;
            border-left: 6px solid #dc3545;
        }
        .mudurluk-detail-header h2 { color: #fff; margin: 0; font-size: 1.5rem; }
        .mudurluk-detail-header p { color: #e7f1ff; margin: 0.5rem 0 0 0; }
    </style>
    """,
    unsafe_allow_html=True,
)

SAYFA_RENDER = {}


def sayfa(name):
    def decorator(func):
        SAYFA_RENDER[name] = func
        return func
    return decorator


def init_session() -> None:
    if "aktif_sayfa" not in st.session_state:
        st.session_state.aktif_sayfa = MENU_SECENEKLERI[0]
    if "secilen_mudurluk" not in st.session_state:
        st.session_state.secilen_mudurluk = None


def sayfaya_git(hedef: str) -> None:
    st.session_state.aktif_sayfa = hedef
    if hedef != "Müdürlüklerimiz":
        st.session_state.secilen_mudurluk = None


def get_stats() -> dict:
    basvurular = tum_basvurulari_getir()
    if not basvurular:
        return {"toplam": 0, "incelemede": 0, "devam": 0, "cozuldu": 0}

    df = pd.DataFrame(basvurular)
    return {
        "toplam": len(df),
        "incelemede": len(df[df["durum"] == "İncelemede"]),
        "devam": len(df[df["durum"] == "Devam Ediyor"]),
        "cozuldu": len(df[df["durum"] == "Çözüldü"]),
    }


def render_sidebar() -> str:
    st.markdown(f'<div class="sidebar-title">{BELEDIYE_ADI}</div>', unsafe_allow_html=True)
    st.markdown(f'<div class="sidebar-subtitle">{SISTEM_ADI}</div>', unsafe_allow_html=True)
    st.markdown('<div class="menu-label">Menü</div>', unsafe_allow_html=True)

    for item in MENU_SECENEKLERI:
        active = st.session_state.aktif_sayfa == item
        wrapper_class = "menu-active" if active else "menu-item"
        st.markdown(f'<div class="{wrapper_class}">', unsafe_allow_html=True)
        if st.button(item, key=f"menu_{item}", use_container_width=True):
            sayfaya_git(item)
            st.rerun()
        st.markdown("</div>", unsafe_allow_html=True)

    st.markdown("---")
    st.caption("© 2026 T.C. Dörtyol Belediyesi")
    return st.session_state.aktif_sayfa


@sayfa("Ana Sayfa")
def render_ana_sayfa() -> None:
    stats = get_stats()

    st.markdown(
        f"""
        <div class="hero-card">
            <h1>{BELEDIYE_ADI}</h1>
            <p>{SISTEM_ADI}</p>
        </div>
        """,
        unsafe_allow_html=True,
    )
    st.markdown(
        """
        <div class="welcome-text">
            <strong>T.C. Dörtyol Belediyesi</strong> e-Belediye başvuru sistemine hoş geldiniz.
            Talep, öneri ve şikayetlerinizi ilgili müdürlüklere buradan iletebilir,
            başvuru numaranız ile sürecinizi takip edebilirsiniz.
        </div>
        """,
        unsafe_allow_html=True,
    )

    c1, c2, c3, c4 = st.columns(4)
    kartlar = [
        (c1, "toplam", "Toplam Başvuru", ""),
        (c2, "incelemede", "İncelemede", " orange"),
        (c3, "cozuldu", "Çözülen Başvuru", " green"),
        (c4, "devam", "Devam Eden", " red"),
    ]
    for col, key, label, cls in kartlar:
        with col:
            st.markdown(
                f"""
                <div class="stat-card{cls}">
                    <div class="stat-value">{stats[key]}</div>
                    <div class="stat-label">{label}</div>
                </div>
                """,
                unsafe_allow_html=True,
            )

    st.divider()
    st.subheader("Hızlı İşlemler")
    b1, b2, b3 = st.columns(3)
    if b1.button("Yeni Başvuru Yap", use_container_width=True, type="primary"):
        sayfaya_git("Vatandaş Başvuru Yap")
        st.rerun()
    if b2.button("Başvuru Sorgula", use_container_width=True):
        sayfaya_git("Başvuru Sorgula")
        st.rerun()
    if b3.button("Müdürlüklerimiz", use_container_width=True):
        sayfaya_git("Müdürlüklerimiz")
        st.rerun()


def render_mudurluk_detay(ad: str) -> None:
    bilgi = MUDURLUK_BILGILERI.get(ad, {})
    if st.button("Müdürlükler Listesine Dön", type="secondary"):
        st.session_state.secilen_mudurluk = None
        st.rerun()

    mudur = bilgi.get("mudur", "—")
    dahili = bilgi.get("telefon_dahili")
    telefon = (
        f"{BELEDIYE_ILETISIM['telefon_santral']} / {dahili}"
        if dahili
        else BELEDIYE_ILETISIM["telefon_santral"]
    )

    st.markdown(
        f"""
        <div class="mudurluk-detail-header">
            <h2>{ad}</h2>
            <p>Müdür: {mudur}</p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    c1, c2 = st.columns(2)
    with c1:
        st.markdown("**İletişim**")
        st.markdown(f"- **Adres:** {BELEDIYE_ILETISIM['adres']}")
        st.markdown(f"- **Telefon:** {BELEDIYE_ILETISIM['telefon']}")
        st.markdown(f"- **Santral / Dahili:** {telefon}")
    with c2:
        st.markdown("**Resmi Kaynak**")
        kaynak = bilgi.get("kaynak", "https://www.dortyol.bel.tr/mudurlukler")
        st.markdown(f"[dortyol.bel.tr üzerinde görüntüle]({kaynak})")

    st.divider()
    st.subheader("Müdürlük Hakkında")
    st.markdown(bilgi.get("aciklama", "Bilgi bulunamadı."))

    gorevler = bilgi.get("gorevler", [])
    if gorevler:
        st.subheader("Görev ve Sorumluluklar")
        for gorev in gorevler:
            st.markdown(f"- {gorev}")

    st.divider()
    if st.button("Bu Müdürlüğe Başvuru Yap", type="primary"):
        sayfaya_git("Vatandaş Başvuru Yap")
        st.rerun()


@sayfa("Müdürlüklerimiz")
def render_mudurlukler() -> None:
    if st.session_state.secilen_mudurluk:
        render_mudurluk_detay(st.session_state.secilen_mudurluk)
        return

    st.markdown('<p class="main-header">Müdürlüklerimiz</p>', unsafe_allow_html=True)
    st.markdown(
        f"""
        <div class="welcome-text">
            <strong>{BELEDIYE_ADI}</strong> bünyesindeki müdürlükler hakkında resmi bilgilere
            buradan ulaşabilirsiniz. Detay görmek istediğiniz müdürlüğe tıklayın.
        </div>
        """,
        unsafe_allow_html=True,
    )

    st.markdown(
        f"**Merkez:** {BELEDIYE_ILETISIM['adres']} | "
        f"**Telefon:** {BELEDIYE_ILETISIM['telefon']}"
    )
    st.divider()

    for i in range(0, len(DEPARTMANLAR), 2):
        cols = st.columns(2)
        for j, col in enumerate(cols):
            idx = i + j
            if idx >= len(DEPARTMANLAR):
                break
            ad = DEPARTMANLAR[idx]
            bilgi = MUDURLUK_BILGILERI.get(ad, {})
            ozet = bilgi.get("aciklama", "")[:140] + "..." if bilgi.get("aciklama") else ""
            mudur = bilgi.get("mudur", "")
            with col:
                st.markdown(
                    f"""
                    <div class="mudurluk-card">
                        <h3>{ad}</h3>
                        <p><strong>Müdür:</strong> {mudur}</p>
                        <p>{ozet}</p>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )
                if st.button("Detayları Gör", key=f"mudurluk_{idx}", use_container_width=True):
                    st.session_state.secilen_mudurluk = ad
                    st.rerun()


@sayfa("Vatandaş Başvuru Yap")
def render_basvuru_formu() -> None:
    st.markdown('<p class="main-header">Vatandaş Başvuru Formu</p>', unsafe_allow_html=True)

    with st.form("basvuru_formu", clear_on_submit=True):
        c1, c2 = st.columns(2)
        with c1:
            tc = st.text_input("TC Kimlik No *", max_chars=11)
            ad = st.text_input("Ad Soyad *")
            tel = st.text_input("Telefon *")
        with c2:
            dep = st.selectbox("Müdürlük *", DEPARTMANLAR)
            konu = st.text_input("Konu *")
            detay = st.text_area("Detay *", height=120)

        belge = st.file_uploader(
            "Belge veya Resim (isteğe bağlı)",
            type=["pdf", "png", "jpg", "jpeg", "webp", "doc", "docx"],
            help="Başvurunuzu destekleyen belge veya fotoğraf yükleyebilirsiniz.",
        )

        submitted = st.form_submit_button("Başvuruyu Gönder", use_container_width=True)

        if submitted:
            tel_clean = tel.replace(" ", "").replace("-", "").replace("(", "").replace(")", "")
            valid = (
                tc.isdigit()
                and len(tc) == 11
                and ad.strip()
                and konu.strip()
                and detay.strip()
                and tel_clean.isdigit()
                and 10 <= len(tel_clean) <= 11
            )
            if not valid:
                st.error("Lütfen zorunlu alanları eksiksiz ve doğru doldurun.")
            else:
                basvuru_id = basvuru_ekle(
                    tc, ad.strip(), tel.strip(), dep, konu.strip(), detay.strip()
                )
                if belge is not None:
                    belge_yolu = kaydet_belge(basvuru_id, belge)
                    basvuru_belge_guncelle(basvuru_id, belge_yolu)
                st.success(f"Başvurunuz alındı. Başvuru Numaranız: #{basvuru_id}")


@sayfa("Başvuru Sorgula")
def render_basvuru_sorgula() -> None:
    st.markdown('<p class="main-header">Başvuru Sorgula</p>', unsafe_allow_html=True)
    basvuru_id = st.number_input("Başvuru Numarası", min_value=1, step=1, format="%d")

    if st.button("Sorgula"):
        basvuru = basvuru_sorgula_id(int(basvuru_id))
        if basvuru:
            st.markdown(
                f"""
                <div class="info-card">
                    <h3>Başvuru No: {basvuru["id"]}</h3>
                    <p><strong>Ad Soyad:</strong> {basvuru["ad_soyad"]}</p>
                    <p><strong>Müdürlük:</strong> {basvuru["departman"]}</p>
                    <p><strong>Konu:</strong> {basvuru["konu"]}</p>
                    <p><strong>Detay:</strong> {basvuru["detay"]}</p>
                    <p><strong>Durum:</strong> {basvuru["durum"]}</p>
                    <p><strong>Tarih:</strong> {basvuru["tarih"]}</p>
                </div>
                """,
                unsafe_allow_html=True,
            )
            if basvuru.get("notlar"):
                st.info(f"Yetkili Notu: {basvuru['notlar']}")
            belge = basvuru.get("belge_dosya", "")
            if belge and Path(belge).exists():
                st.markdown(f"**Ek Belge:** {Path(belge).name}")
                with open(belge, "rb") as file:
                    st.download_button("Belgeyi İndir", file, file_name=Path(belge).name)
        else:
            st.warning("Bu numaraya ait başvuru bulunamadı.")


@sayfa("Belediye Yönetici Paneli")
def render_yonetici_paneli() -> None:
    st.markdown('<p class="main-header">Belediye Yönetici Paneli</p>', unsafe_allow_html=True)

    basvurular = tum_basvurulari_getir()
    if not basvurular:
        st.info("Henüz kayıtlı başvuru bulunmuyor.")
        return

    df = pd.DataFrame(basvurular)
    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Toplam Başvuru", len(basvurular))
    c2.metric("İncelemede", len(df[df["durum"] == "İncelemede"]))
    c3.metric("Devam Ediyor", len(df[df["durum"] == "Devam Ediyor"]))
    c4.metric("Çözüldü", len(df[df["durum"] == "Çözüldü"]))

    st.divider()
    cc, cf = st.columns([2, 1])
    with cc:
        dept_counts = df["departman"].value_counts().reset_index()
        dept_counts.columns = ["Müdürlük", "Başvuru Sayısı"]
        fig = px.bar(
            dept_counts,
            x="Müdürlük",
            y="Başvuru Sayısı",
            color="Müdürlük",
            color_discrete_sequence=["#0d6efd", "#dc3545", "#198754", "#fd7e14"],
        )
        fig.update_layout(
            showlegend=False,
            plot_bgcolor="#FFFFFF",
            paper_bgcolor="#FFFFFF",
            height=400,
            xaxis_tickangle=-45,
        )
        st.plotly_chart(fig, use_container_width=True)

    with cf:
        secilen = st.selectbox("Müdürlük Filtresi", ["Tümü"] + DEPARTMANLAR)

    filtered = tum_basvurulari_getir(departman=secilen)
    if not filtered:
        st.info("Seçilen filtreye uygun başvuru bulunamadı.")
        return

    display_df = pd.DataFrame(filtered)
    if "belge_dosya" in display_df.columns:
        display_df["belge"] = display_df["belge_dosya"].apply(
            lambda x: Path(x).name if x else "-"
        )
        cols = ["id", "ad_soyad", "departman", "konu", "durum", "belge", "tarih"]
    else:
        cols = ["id", "ad_soyad", "departman", "konu", "durum", "tarih"]

    st.dataframe(display_df[cols], use_container_width=True, hide_index=True)

    st.divider()
    st.subheader("Başvuru Güncelle")
    secilen_id = st.selectbox("Başvuru Seç", [item["id"] for item in filtered])
    secilen_basvuru = basvuru_sorgula_id(secilen_id)

    c1, c2 = st.columns(2)
    with c1:
        yeni_durum = st.selectbox(
            "Durum",
            DURUMLAR,
            index=DURUMLAR.index(secilen_basvuru["durum"]),
        )
    with c2:
        belge = secilen_basvuru.get("belge_dosya", "")
        if belge and Path(belge).exists():
            st.text_input("Ek Belge", value=Path(belge).name, disabled=True)

    notlar = st.text_area("Yetkili Notu", value=secilen_basvuru.get("notlar", ""))

    if st.button("Güncelle", use_container_width=True):
        basvuru_durum_guncelle(secilen_id, yeni_durum, notlar)
        st.success("Başvuru güncellendi.")
        st.rerun()


def main() -> None:
    init_db()
    init_session()

    with st.sidebar:
        aktif_sayfa = render_sidebar()

    SAYFA_RENDER[aktif_sayfa]()


if __name__ == "__main__":
    main()
''',
    encoding="utf-8",
)

print("Tum dosyalar yazildi.")
