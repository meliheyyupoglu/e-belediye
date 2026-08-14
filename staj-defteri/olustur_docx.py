# -*- coding: utf-8 -*-
from pathlib import Path
from docx import Document
from docx.shared import Inches, Pt, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH

BASE = Path(__file__).parent
IMG = BASE / "gorseller"
OUT = BASE / "Staj_Defteri_20_Gun.docx"

DAYS = [
    {
        "title": "1. Gün — Oryantasyon ve Kaynaşma",
        "image": "gun-01-oryantasyon.png",
        "konu": "Belediye tanıtımı ve proje planlaması",
        "ana_hatlar": "Ekip tanıtımı · Site incelemesi · Proje hedefleri",
        "text": (
            "Stajın ilk gününde Bilgi İşlem Müdürlüğü'ne gittim, ekiple tanıştım. "
            "Bana anlatılan görev şuydu: vatandaşların online başvuru yapabileceği, "
            "başvurularını sorgulayabileceği ve harita üzerinden şikayet iletebileceği "
            "bir e-Belediye sitesi geliştirmek. Ben de dortyol.bel.tr'yi inceledim; "
            "müdürlükleri, duyuruları ve mevcut hizmetleri not aldım. Eski Streamlit "
            "prototipi vardı ama bunun yerine Next.js ile daha modern bir site "
            "yapılmasına karar verdik. İlk gün kod yazmadım, sadece projeyi kafamda "
            "oturttum; başvuru, sorgulama, randevu ve yönetici paneli modüllerini "
            "planladım."
        ),
    },
    {
        "title": "2. Gün — Proje Kurulumu ve Temel Altyapı",
        "image": "gun-02-kurulum.png",
        "konu": "Next.js projesi kurulumu ve Tailwind tema ayarları",
        "ana_hatlar": "Next.js · TypeScript · Tailwind · Layout",
        "text": (
            "Next.js 14 ile App Router mimarisinde yeni projeyi ben kurdum. TypeScript "
            "kullandım; değişken ve fonksiyonlara tip yazarak hata yapmayı azaltmaya "
            "çalıştım. Görünüm için Tailwind CSS'i ekledim, belediye mavi tonlarını "
            "tema dosyasına yazdım. globals.css'e btn-primary, form-input gibi ortak "
            "stilleri ben hazırladım. layout.tsx'te site başlığını, açıklamayı ve "
            "PWA manifest bağlantısını tanımladım. Sonra npm run dev ile localhost'ta "
            "çalıştırıp ana sayfanın düzgün açıldığını kontrol ettim."
        ),
    },
    {
        "title": "3. Gün — Header, Footer ve Navigasyon",
        "image": "gun-03-menu.png",
        "konu": "React bileşenleri ve responsive menü yapısı",
        "ana_hatlar": "Header/Footer · Mobil menü · usePathname · Navigasyon",
        "text": (
            "Sitenin her sayfasında görünecek Header ve Footer bileşenlerini React ile "
            "ben yazdım. usePathname hook'u ile kullanıcının hangi sayfada olduğunu "
            "bulup menüde o linki vurguladım. Telefonda çalışsın diye hamburger menü "
            "ekledim; tıklayınca sağdan kayarak açılıyor. Menü linklerini constants.ts "
            "dosyasındaki NAV_ITEMS dizisinden çekiyorum, yeni sayfa eklemek için "
            "sadece o dosyayı güncellemem yeterli oluyor. Footer'a KVKK linki, hızlı "
            "erişim ve iletişim bilgilerini koydum. Hem bilgisayarda hem telefonda "
            "test ettim, düzgün çalışıyordu."
        ),
    },
    {
        "title": "4. Gün — Ana Sayfa, Hero ve Müdürlükler",
        "image": "gun-04-anasayfa.png",
        "konu": "Ana sayfa bileşenleri ve müdürlük modülü",
        "ana_hatlar": "Hero · E-hizmet kartları · API istatistik · Müdürlükler",
        "text": (
            "Ana sayfada hero alanını, e-hizmet kartlarını ve canlı istatistik bölümünü "
            "ben oluşturdum. E-hizmet listesini services.ts dosyasından dinamik "
            "ürettirdim. HeroSearch bileşenini yazdım; site içinde arama yapılabiliyor, "
            "yazarken kısa bir bekleyip arama API'sine istek atıyor. Müdürlükler "
            "sayfasında 13 müdürlüğü listeledim, her birine tıklayınca slug ile "
            "detay sayfasına gidiyor. StatsSection bileşenini de ekledim; "
            "/api/basvurular?stats=1 endpoint'inden başvuru sayılarını çekip "
            "animasyonlu sayaçla gösteriyorum."
        ),
    },
    {
        "title": "5. Gün — Veritabanı Tasarımı ve Turso Entegrasyonu",
        "image": "gun-05-veritabani.png",
        "konu": "Turso veritabanı, tablo tasarımı ve CRUD işlemleri",
        "ana_hatlar": "Turso/libSQL · Tablo şeması · db.ts · initDb()",
        "text": (
            "Başvuruların kaybolmaması için Turso (libSQL) bulut veritabanını ben "
            "kurdum. basvurular, duyurular, randevular ve otp_kodlari tablolarını "
            "tasarladım. Başvuru tablosuna harita şikayetleri için lat, lng, adres "
            "ve basvuru_tipi kolonlarını da ekledim. db.ts dosyasında ekleme, okuma "
            "ve güncelleme fonksiyonlarını yazdım; Basvuru ve Randevu interface'leri "
            "ile tip güvenliği sağladım. initDb() fonksiyonunu yazdım, site açılınca "
            "tablolar otomatik oluşuyor. Sonra test kaydı atıp veritabanından "
            "okuyarak doğru çalıştığını kontrol ettim."
        ),
    },
    {
        "title": "6. Gün — Online Başvuru Formu ve API",
        "image": "gun-06-basvuru.png",
        "konu": "Başvuru formu ve POST API endpoint'i",
        "ana_hatlar": "Form validasyon · API route · Vercel Blob · Başvuru no",
        "text": (
            "/basvuru sayfasına TC, ad soyad, telefon, departman, konu ve açıklama "
            "alanlarını koyduğum formu ben hazırladım. Form gönderilince POST "
            "/api/basvurular endpoint'ine istek gidiyor; bu API'yi de ben yazdım. "
            "API tarafında TC'nin 11 haneli olup olmadığını ve zorunlu alanları "
            "kontrol ediyorum, hata varsa mesaj dönüyorum. Dosya eklenmişse Vercel "
            "Blob'a yüklüyorum, linki veritabanına kaydediyorum. Başvuru başarılı "
            "olunca otomatik numara üretiyorum ve vatandaşa #123 gibi gösteriyorum. "
            "Resend ayarlıysa belediye yetkilisine de e-posta gönderiyorum."
        ),
    },
    {
        "title": "7. Gün — Başvuru Sorgulama ve İstatistikler",
        "image": "gun-07-sorgulama.png",
        "konu": "Sorgulama sayfası ve istatistik API'si",
        "ana_hatlar": "GET API · Durum badge · getStats() · Sayaç animasyonu",
        "text": (
            "Vatandaşlar başvuru numarasıyla takip edebilsin diye /sorgula sayfasını "
            "ben geliştirdim. Numara girilince GET /api/basvurular/[id] ile kaydı "
            "çekiyorum; durum, departman, konu, tarih ve varsa konum bilgisini "
            "gösteriyorum. Durumları renkli badge'lerle ayırdım: İncelemede turuncu, "
            "Devam Ediyor kırmızı, Çözüldü yeşil. getStats() fonksiyonunu yazdım, "
            "veritabanındaki başvuruları sayıp özet istatistik üretiyor. Ana sayfadaki "
            "StatsSection'da bu veriyi fetch ile çekip animasyonlu sayaçla "
            "gösteriyorum."
        ),
    },
    {
        "title": "8. Gün — Duyurular, İletişim ve Site Araması",
        "image": "gun-08-duyurular.png",
        "konu": "Duyuru modülü, iletişim formu ve arama API'si",
        "ana_hatlar": "Duyuru CRUD · İletişim API · SearchModal · Abonelik",
        "text": (
            "Duyuru listeleme ve detay sayfalarını veritabanına bağladım. Tablo boşsa "
            "örnek duyuruları otomatik yükleyecek şekilde ayarladım. İletişim formunu "
            "yazdım; POST /api/iletisim ile mesajları iletisim_mesajlari tablosuna "
            "kaydediyorum. SearchModal bileşenini ekledim, Ctrl+K ile açılıyor; "
            "yazarken /api/arama endpoint'ine istek atıyorum. AbonelikForm ile "
            "e-posta bülten kaydı da alabiliyorum. İletişim sayfasına Google Maps "
            "haritasını da embed ettim."
        ),
    },
    {
        "title": "9. Gün — Harita Tabanlı Şikayet Sistemi",
        "image": "gun-09-harita.png",
        "konu": "Leaflet harita entegrasyonu ve konum seçimi",
        "ana_hatlar": "Leaflet · react-leaflet · Şikayet tipleri · Sınır kontrolü",
        "text": (
            "Su kesintisi, elektrik arızası ve bozuk yol şikayetleri için Leaflet "
            "harita kütüphanesini projeye ben entegre ettim. react-leaflet ile harita "
            "bileşenini yazdım; Next.js'te sunucu tarafı sorun çıkarmasın diye "
            "dynamic import ile istemci tarafında yüklüyorum. HaritaSikayetWorkspace'i "
            "kurdum: solda konum seçimi ve şikayet türü, sağda OpenStreetMap haritası "
            "var. harita.ts dosyasında üç şikayet tipini tanımladım. isInDortyolBounds() "
            "fonksiyonunu yazdım; Dörtyol dışına tıklanırsa kabul etmiyorum."
        ),
    },
    {
        "title": "10. Gün — Reverse Geocoding ve Adres Otomasyonu",
        "image": "gun-10-adres.png",
        "konu": "Koordinattan adrese çevirme servisi",
        "ana_hatlar": "Nominatim API · Reverse geocode · Otomatik adres · Fallback",
        "text": (
            "Haritaya tıklayınca koordinatın adrese dönüşmesi için reverse geocoding "
            "servisini ben bağladım. /api/geocode/reverse endpoint'ini yazdım; lat ve "
            "lng değerlerini alıp Nominatim API'sine gönderiyorum. Dönen cevaptan "
            "mahalle ve cadde bilgisini birleştirip adres alanını dolduruyorum. "
            "Su ve elektrikte detaylı adres, bozuk yolda cadde odaklı kısa format "
            "kullanıyorum. Nominatim cevap vermezse Photon servisine düşüyorum. "
            "Adres alınırken ekranda yükleniyor yazısı çıkıyor, vatandaş isterse "
            "adresi elle de düzenleyebiliyor."
        ),
    },
    {
        "title": "11. Gün — Yönetici Paneli ve Kimlik Doğrulama",
        "image": "gun-11-admin.png",
        "konu": "Admin giriş sistemi ve başvuru yönetimi",
        "ana_hatlar": "Session cookie · Login API · Durum güncelleme · CSV export",
        "text": (
            "Belediye personeli için şifre korumalı /yonetici panelini ben yaptım. "
            "Giriş POST /api/auth/login ile oluyor; başarılı olunca session cookie "
            "oluşturuyorum, 24 saat geçerli kalıyor. Panelde her istekte oturum "
            "kontrolü yapıyorum. Başvuruları listeledim, departmana göre "
            "filtreleyebiliyorum. Durum, not ve atanan personeli PATCH API ile "
            "güncelliyorum. CSV export özelliğini de ekledim; Türkçe karakterler "
            "Excel'de bozulmasın diye UTF-8 BOM kullandım."
        ),
    },
    {
        "title": "12. Gün — Dashboard, Admin Harita ve CMS",
        "image": "gun-12-admin-icerik.png",
        "konu": "İstatistik paneli, harita görünümü ve duyuru yönetimi",
        "ana_hatlar": "Dashboard stats · AdminMap · Kesinti katmanı · CMS",
        "text": (
            "Yönetici dashboard'una getDashboardStats() fonksiyonunu yazdım; toplam "
            "başvuru, durum dağılımı, şikayet tipi dağılımı ve en çok başvuru gelen "
            "mahalleleri gösteriyorum. AdminMap bileşenini yaptım; koordinatlı "
            "başvuruları Leaflet haritasında pin olarak gösteriyorum, pin rengini "
            "şikayet tipine göre değiştiriyorum. Planlı kesintileri kesinti_bolgeleri "
            "tablosundan çekip haritaya ayrı katman olarak ekledim. CMS modülünde "
            "duyuru ekleme, düzenleme ve silme yaptım. Galeri sayfasında başvurulara "
            "eklenen fotoğrafları listeliyorum."
        ),
    },
    {
        "title": "13. Gün — OTP, Randevu, Chatbot ve KVKK",
        "image": "gun-13-asistan.png",
        "konu": "E-posta doğrulama, randevu modülü ve yardım asistanı",
        "ana_hatlar": "OTP API · Randevu · ChatWidget · KVKK sayfaları",
        "text": (
            "Başvuru geçmişi gibi kişisel verilere erişim için OTP doğrulama sistemini "
            "ben kurdum. /api/otp/send endpoint'i 6 haneli kod üretip Resend ile "
            "e-posta gönderiyor; kodu otp_kodlari tablosuna kaydediyorum, 10 dakika "
            "geçerli. /basvuru/gecmis sayfasında TC ve telefon girip kodu doğruladıktan "
            "sonra geçmiş başvuruları gösteriyorum. Randevu modülünü de yaptım; "
            "departman, tarih ve saat seçilip randevular tablosuna kaydediliyor. "
            "ChatWidget'ı ekledim; önce FAQ'dan cevap arıyor, bulamazsa OpenAI "
            "devreye giriyor. KVKK, gizlilik ve kullanım koşulları sayfalarını "
            "da ben yazdım."
        ),
    },
    {
        "title": "14. Gün — Mobil UI, Hero Yenileme ve Demo Veri",
        "image": "gun-14-mobil-yayin.png",
        "konu": "Responsive tasarım, ana sayfa güncelleme ve test verileri",
        "ana_hatlar": "Mobil UI · Hero · seed-data · memory-store · Harita akışı",
        "text": (
            "Mobil görünümü iyileştirdim; kaydırmalı yan menü, bottom sheet asistan "
            "ve kart tabanlı meclis listesi ekledim. Ana sayfa hero bölümünü Dörtyol "
            "görseli, büyük arama çubuğu ve AdminLoginModal ile yeniledim. Test için "
            "seed-data.ts modülünü yazdım; yaklaşık 80 örnek başvuru ve 20 randevu "
            "üretiyor. Turso yokken memory-store.ts devreye giriyor, sayaçlar boş "
            "kalmıyor. Harita şikayetinde konum seçince sessionStorage ile ayrı "
            "başvuru sayfasına yönlendirdim."
        ),
    },
    {
        "title": "15. Gün — Test, Vercel Deploy ve Proje Sunumu",
        "image": "gun-14-mobil-yayin.png",
        "konu": "Production deploy, test ve staj sunumu",
        "ana_hatlar": "Vercel · Env ayarları · PWA · Demo sunumu",
        "text": (
            "Projeyi test edip ilk kez canlıya aldım. Kodu GitHub'a push ettim, "
            "Vercel ile deploy yaptım. TURSO_DATABASE_URL, ADMIN_SECRET, "
            "BLOB_READ_WRITE_TOKEN ve RESEND_API_KEY env değişkenlerini ayarladım. "
            "Başvuru yapma, sorgulama, harita şikayeti ve admin panelden durum "
            "güncelleme akışlarını test ettim. manifest.json ile PWA ayarlarını "
            "yaptım. Başkan ve meclis bilgilerini resmi siteden güncelledim."
        ),
    },
    {
        "title": "16. Gün — Karanlık Mod Altyapısı",
        "image": "gun-04-anasayfa.png",
        "konu": "Karanlık mod tema sistemi ve ThemeProvider",
        "ana_hatlar": "darkMode class · ThemeProvider · localStorage · Toggle",
        "text": (
            "Kullanıcıların gece rahat kullanabilmesi için karanlık mod özelliğini "
            "planladım ve altyapısını kurdum. Tailwind config dosyasına darkMode: "
            "'class' ayarını ekledim. ThemeProvider bileşenini yazdım; tema tercihini "
            "localStorage'da saklıyorum ve html etiketine dark sınıfını ekliyorum. "
            "DarkModeToggle bileşenini header'a yerleştirdim; güneş/ay ikonu ile "
            "açık ve karanlık mod arasında geçiş yapılabiliyor. İlk açılışta sistem "
            "tercihini (prefers-color-scheme) kontrol ediyorum. AppProviders ile "
            "ThemeProvider'ı root layout'a bağladım."
        ),
    },
    {
        "title": "17. Gün — Karanlık Mod Arayüz Uyarlaması",
        "image": "gun-03-menu.png",
        "konu": "Bileşen ve CSS dark variant güncellemeleri",
        "ana_hatlar": "globals.css dark: · Header · Kartlar · Formlar",
        "text": (
            "Karanlık modun tüm sitede düzgün görünmesi için CSS sınıflarını "
            "güncelledim. globals.css'teki stat-card, info-card, form-input, "
            "btn-secondary ve nav-link sınıflarına dark: varyantları ekledim. "
            "Header'ın sticky modunda dark:bg-gray-900 ve dark:border-gray-800 "
            "sınıflarını kullandım. Mobil menü panelini de karanlık temaya "
            "uyumlu hale getirdim. Body arka planını dark:bg-gray-900 yaptım. "
            "Bilgisayar ve telefonda açık/karanlık geçişini test ettim, kart "
            "ve form alanlarının okunabilirliğini kontrol ettim."
        ),
    },
    {
        "title": "18. Gün — Bildirim Sistemi",
        "image": "gun-11-admin.png",
        "konu": "Uygulama içi bildirim modülü ve toast mesajları",
        "ana_hatlar": "bildirimler tablosu · API · NotificationBell · ToastProvider",
        "text": (
            "Vatandaşların başvuru durumu değişince haberdar olması için bildirim "
            "sistemini kurdum. bildirimler tablosunu veritabanına ekledim; "
            "kullanici_id, baslik, mesaj, okundu ve tarih alanları var. "
            "GET /api/bildirimler ve PATCH /api/bildirimler/[id] endpoint'lerini "
            "yazdım. Admin panelden başvuru durumu güncellenince kayıtlı "
            "vatandaşa otomatik bildirim düşüyor. Header'a NotificationBell "
            "bileşenini ekledim; okunmamış sayısı kırmızı rozetle gösteriliyor. "
            "ToastProvider ile kayıt ve giriş işlemlerinde anlık toast mesajları "
            "da gösteriyorum."
        ),
    },
    {
        "title": "19. Gün — Vatandaş Kayıt ve Giriş Paneli",
        "image": "gun-06-basvuru.png",
        "konu": "Kullanıcı kayıt sistemi ve oturum yönetimi",
        "ana_hatlar": "kullanicilar tablosu · /kayit · /giris · citizen session",
        "text": (
            "Vatandaşların hesap oluşturup giriş yapabilmesi için kayıt panelini "
            "geliştirdim. kullanicilar tablosunu ekledim; TC, ad soyad, telefon, "
            "e-posta ve scrypt ile hashlenmiş şifre saklanıyor. citizen-auth.ts "
            "modülünde şifre hashleme ve session cookie mantığını yazdım. "
            "/kayit sayfasında kayıt formu, /giris sayfasında giriş formu var. "
            "POST /api/auth/register ve POST /api/auth/citizen/login API'lerini "
            "oluşturdum. Header'daki Giriş Yap ve Kayıt Ol butonlarını bu sayfalara "
            "yönlendirdim; yönetici girişi /yonetici/login'de kaldı. Kayıt olunca "
            "hoş geldiniz bildirimi otomatik oluşuyor."
        ),
    },
    {
        "title": "20. Gün — Entegrasyon Testi ve Final Sunum",
        "image": "gun-14-mobil-yayin.png",
        "konu": "Yeni modüllerin testi ve staj kapanış sunumu",
        "ana_hatlar": "Entegrasyon test · Karanlık mod · Bildirim · Kayıt · Sunum",
        "text": (
            "Son gün eklediğim üç modülü entegrasyon testinden geçirdim. Karanlık "
            "mod geçişini, bildirim zilini ve kayıt/giriş akışını baştan sona "
            "denedim: kayıt ol → giriş yap → admin durum güncelle → bildirim "
            "geldi mi kontrol ettim. Mobil menüde kayıt ve giriş linklerini "
            "doğruladım. Staj sorumlusuna güncellenmiş projeyi canlı demo ile "
            "gösterdim; karanlık mod, bildirim sistemi ve vatandaş panelini "
            "anlattım. 20 günlük staj defterimi tamamlayıp teslim ettim."
        ),
    },
]


def main():
    doc = Document()

    for section in doc.sections:
        section.top_margin = Cm(2)
        section.bottom_margin = Cm(2)
        section.left_margin = Cm(2.5)
        section.right_margin = Cm(2.5)

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
        "Next.js · TypeScript · Tailwind CSS · Turso · Leaflet · Vercel\n"
    )
    run2.font.size = Pt(11)

    doc.add_paragraph()
    info = doc.add_paragraph()
    info.alignment = WD_ALIGN_PARAGRAPH.CENTER
    info.add_run("Staj Süresi: 20 İş Günü\n").font.size = Pt(11)
    info.add_run("Stajyer: .............................................\n").font.size = Pt(11)
    info.add_run("Staj Sorumlusu: .............................................\n").font.size = Pt(11)

    doc.add_page_break()

    for day in DAYS:
        doc.add_heading(day["title"], level=1)

        kisa = doc.add_paragraph()
        k1 = kisa.add_run("Çalışma Konusu: ")
        k1.bold = True
        k1.font.size = Pt(10)
        k2 = kisa.add_run(day["konu"])
        k2.font.size = Pt(10)

        kisa2 = doc.add_paragraph()
        a1 = kisa2.add_run("Ana Hatlar: ")
        a1.bold = True
        a1.font.size = Pt(10)
        a2 = kisa2.add_run(day["ana_hatlar"])
        a2.font.size = Pt(10)

        doc.add_paragraph()

        img_path = IMG / day["image"]
        if img_path.exists():
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            run = p.add_run()
            run.add_picture(str(img_path), width=Inches(5.2))
            cap = doc.add_paragraph(f"Şekil: {day['title']}")
            cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            cap.runs[0].font.size = Pt(9)
            cap.runs[0].italic = True

        doc.add_paragraph()

        detail_run = doc.add_paragraph().add_run("Çalışma ile İlgili Açıklamalar:")
        detail_run.bold = True
        detail_run.font.size = Pt(11)

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
