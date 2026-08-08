"""T.C. Dörtyol Belediyesi Vatandaş Başvuru ve Yönetim Sistemi."""

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
        div[data-testid="stSidebar"] .mudurluk-item {
            font-size: 0.8rem; color: #495057; line-height: 1.5;
            padding: 0.15rem 0; border-bottom: 1px solid #f1f3f5;
        }
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


def sayfaya_git(hedef: str) -> None:
    st.session_state.aktif_sayfa = hedef


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

    st.markdown('<div class="menu-label">Müdürlüklerimiz</div>', unsafe_allow_html=True)
    for departman in DEPARTMANLAR:
        st.markdown(f'<div class="mudurluk-item">{departman}</div>', unsafe_allow_html=True)

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
    if b3.button("Yönetici Paneli", use_container_width=True):
        sayfaya_git("Belediye Yönetici Paneli")
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
