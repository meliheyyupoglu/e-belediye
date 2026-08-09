# -*- coding: utf-8 -*-
from pathlib import Path
from docx import Document
from docx.shared import Inches, Pt, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH

BASE = Path(__file__).parent
IMG = BASE / "gorseller"
OUT = BASE / "Staj_Defteri_e-Belediye.docx"

DAYS = [
    {
        "title": "1. Gün — Oryantasyon ve Kaynaşma",
        "image": "gun-01-oryantasyon.png",
        "text": (
            "Stajın ilk günüydü. Bilgi İşlem Müdürlüğü'ne tanıtıldım, ekiple tanıştım. "
            "Belediyenin dijitalleşme hedefleri ve bana verilen görev anlatıldı: vatandaşların "
            "online başvuru yapabileceği bir e-Belediye portalı geliştirmek. Mevcut belediye "
            "sitesini inceledim; hangi hizmetlerin dijitale taşınacağını not aldım. Kod yazmadım, "
            "projenin kapsamını öğrendim."
        ),
    },
    {
        "title": "2. Gün — Proje Kurulumu",
        "image": "gun-02-kurulum.png",
        "text": (
            "Next.js 14 ve TypeScript ile projeyi oluşturdum, arayüz için Tailwind CSS ekledim. "
            "Belediye renklerini tema olarak tanımladım. Ortak kullanılacak buton, kart ve container "
            "stillerini hazırladım. Ana layout'a header, footer ve içerik alanını yerleştirdim. "
            "npm run dev ile localhost'ta çalıştığını doğruladım."
        ),
    },
    {
        "title": "3. Gün — Header, Footer, Menü",
        "image": "gun-03-menu.png",
        "text": (
            "Üst menü ve footer bileşenlerini React ile yazdım. Telefon numarası, logo, sayfa "
            "linkleri ve mobil hamburger menü ekledim. Aktif sayfayı vurgulamak için usePathname "
            "hook'unu kullandım. İç sayfalar için breadcrumb'lı başlık alanı hazırladım. "
            "Masaüstü ve mobilde menü geçişlerini test ettim."
        ),
    },
    {
        "title": "4. Gün — Ana Sayfa ve Müdürlükler",
        "image": "gun-04-anasayfa.png",
        "text": (
            "Ana sayfada hero bölümü, e-hizmet kartları ve duyuru alanı oluşturdum. Hizmet "
            "listesini ayrı bir veri dosyasında tuttum; kartlar bu listeden dinamik üretiliyor. "
            "Müdürlükler sayfasını yaptım; 13 müdürlüğün bilgileri listeleniyor, detay sayfası "
            "slug ile açılıyor."
        ),
    },
    {
        "title": "5. Gün — Veritabanı",
        "image": "gun-05-veritabani.png",
        "text": (
            "Başvuruların kalıcı saklanması için Turso (libSQL) veritabanını kurdum. Başvuru, "
            "duyuru ve randevu tablolarını tasarladım. CRUD fonksiyonlarını yazdım; ekleme, "
            "okuma ve güncelleme işlemleri TypeScript tipleriyle tanımlandı. Test kaydı atıp "
            "veritabanından okudum."
        ),
    },
    {
        "title": "6. Gün — Online Başvuru Formu",
        "image": "gun-06-basvuru.png",
        "text": (
            "Başvuru sayfasında ad, telefon, konu ve mesaj alanlarını olan formu tasarladım. "
            "POST API ile gelen veriyi kontrol edip veritabanına kaydediyorum. Boş alan ve format "
            "kontrolü yaptım. Başarılı başvuruda kullanıcıya otomatik artan başvuru numarası "
            "gösteriliyor."
        ),
    },
    {
        "title": "7. Gün — Başvuru Sorgulama",
        "image": "gun-07-sorgulama.png",
        "text": (
            "Sorgulama sayfasını yazdım. Vatandaş numarasını girince GET API ile kayıt çekiliyor. "
            "İncelemede, devam ediyor, çözüldü durumları renkli badge'lerle gösteriliyor. Ana "
            "sayfaya istatistik kartları ekledim; sayılar API'den gelip animasyonlu artıyor."
        ),
    },
    {
        "title": "8. Gün — Duyurular ve İletişim",
        "image": "gun-08-duyurular.png",
        "text": (
            "Duyuru listeleme ve detay sayfalarını yaptım. İletişim sayfasına adres, telefon ve "
            "Google Maps embed ekledim. Site içi arama için modal pencere yazdım; yazarken debounce "
            "ile API'ye istek gidiyor, müdürlük ve duyurularda arama yapılabiliyor."
        ),
    },
    {
        "title": "9. Gün — Harita Entegrasyonu",
        "image": "gun-09-harita.png",
        "text": (
            "Su kesintisi, elektrik ve bozuk yol şikayetleri için Leaflet harita kütüphanesini "
            "entegre ettim. Kullanıcı haritadan konum seçip şikayet bırakabiliyor. Harita Dörtyol "
            "koordinatları ve sınır kontrolüyle kısıtlandı. SSR sorunu olmaması için harita "
            "bileşenini dynamic import ile yükledim."
        ),
    },
    {
        "title": "10. Gün — Adres Çözümleme",
        "image": "gun-10-adres.png",
        "text": (
            "Haritaya tıklanınca koordinatı adrese çevirmek için Nominatim reverse geocoding API "
            "kullandım. Adres otomatik doluyor, kullanıcı isterse düzenleyebiliyor. Şikayet "
            "tipine göre detaylı veya kısa adres gösterimi ayarladım. Sorgulama ekranında "
            "başvurunun harita üzerindeki konumu da gösteriliyor."
        ),
    },
    {
        "title": "11. Gün — Yönetici Paneli",
        "image": "gun-11-admin.png",
        "text": (
            "Cookie tabanlı oturum ile şifre korumalı yönetici paneli yaptım. Dashboard'da başvuru "
            "istatistikleri var. Başvurular listeleniyor, durum güncellenebiliyor. CSV export ile "
            "Excel'e aktarma ekledim; Türkçe karakterler için UTF-8 BOM kullandım."
        ),
    },
    {
        "title": "12. Gün — Admin Harita ve İçerik",
        "image": "gun-12-admin-icerik.png",
        "text": (
            "Yöneticiler harita üzerinden şikayetleri pin olarak görebiliyor; renk şikayet tipine "
            "göre değişiyor. Duyuru ekleme/silme ekranı yazdım. Projeler ve etkinlikler sayfalarını "
            "belediye sitesindeki gerçek içeriklerle doldurdum."
        ),
    },
    {
        "title": "13. Gün — Asistan, Randevu, KVKK",
        "image": "gun-13-asistan.png",
        "text": (
            "Sağ altta açılan chatbot ekledim; anahtar kelime eşleştirmesiyle sık sorulan "
            "sorulara otomatik cevap veriyor. Saate göre selamlama ve WhatsApp yönlendirmesi var. "
            "OTP doğrulama ve randevu alma modülünü hazırladım. KVKK, gizlilik ve kullanım "
            "koşulları sayfalarını ekledim."
        ),
    },
    {
        "title": "14. Gün — Mobil, Test ve Yayın",
        "image": "gun-14-mobil-yayin.png",
        "text": (
            "Mobil görünümü düzenledim: kaydırmalı yan menü, bottom sheet asistan, kart tabanlı "
            "meclis listesi, safe-area desteği. Başkan ve meclis bilgilerini resmi siteden "
            "güncelledim. Projeyi GitHub + Vercel ile canlıya aldım, env değişkenlerini tanımlayıp "
            "tüm modülleri test ettim. Son gün demo sunumu yaptım."
        ),
    },
]


def main():
    doc = Document()

    # Sayfa kenar boşlukları
    for section in doc.sections:
        section.top_margin = Cm(2)
        section.bottom_margin = Cm(2)
        section.left_margin = Cm(2.5)
        section.right_margin = Cm(2.5)

    # Kapak
    title = doc.add_heading("STAJ DEFTERİ", level=0)
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER

    sub = doc.add_paragraph()
    sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = sub.add_run("T.C. Dörtyol Belediyesi\nBilgi İşlem Müdürlüğü")
    run.font.size = Pt(14)
    run.bold = True

    sub2 = doc.add_paragraph()
    sub2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run2 = sub2.add_run(
        "\ne-Belediye Vatandaş Başvuru ve Yönetim Sistemi\n"
        "Next.js · TypeScript · Tailwind CSS · Turso · Leaflet\n"
    )
    run2.font.size = Pt(11)

    doc.add_paragraph()
    info = doc.add_paragraph()
    info.alignment = WD_ALIGN_PARAGRAPH.CENTER
    info.add_run("Staj Süresi: 14 İş Günü\n").font.size = Pt(11)
    info.add_run("Stajyer: .............................................\n").font.size = Pt(11)
    info.add_run("Staj Sorumlusu: .............................................\n").font.size = Pt(11)

    doc.add_page_break()

    for day in DAYS:
        doc.add_heading(day["title"], level=1)

        img_path = IMG / day["image"]
        if img_path.exists():
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            run = p.add_run()
            run.add_picture(str(img_path), width=Inches(5.8))
            cap = doc.add_paragraph(f"Şekil: {day['title']}")
            cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            cap.runs[0].font.size = Pt(9)
            cap.runs[0].italic = True
        else:
            doc.add_paragraph(f"[Görsel bulunamadı: {day['image']}]")

        doc.add_paragraph()
        para = doc.add_paragraph(day["text"])
        para.paragraph_format.line_spacing = 1.25
        para.paragraph_format.space_after = Pt(6)
        for run in para.runs:
            run.font.size = Pt(11)

        sig = doc.add_paragraph()
        sig.add_run("\nStajyer İmza: .........................    ").font.size = Pt(10)
        sig.add_run("Onay: .........................").font.size = Pt(10)

        doc.add_page_break()

    doc.save(OUT)
    print(f"Olusturuldu: {OUT}")


if __name__ == "__main__":
    main()
