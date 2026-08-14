# STAJ DEFTERİ — e-Belediye (15 Gün)

Teknik seviye: orta — teknoloji adları + ne işe yaradıkları birlikte anlatılıyor.

---

## 1. Gün — Oryantasyon ve Kaynaşma

**Çalışma Konusu:** Belediye tanıtımı ve proje planlaması  
**Ana Hatlar:** Ekip tanıtımı · Site incelemesi · Proje hedefleri

**Çalışma ile İlgili Açıklamalar:**  
Stajın ilk gününde Bilgi İşlem Müdürlüğü'ne tanıtıldım. Görevim: vatandaşların online başvuru yapabileceği, sorgulayabileceği ve harita üzerinden şikayet iletebileceği bir e-Belediye web uygulaması geliştirmek. dortyol.bel.tr incelendi. Eski Streamlit prototipi yerine React tabanlı Next.js projesine geçileceğine karar verildi. Modüller planlandı: başvuru, sorgulama, randevu, yönetici paneli.

---

## 2. Gün — Proje Kurulumu

**Çalışma Konusu:** Next.js projesi kurulumu ve Tailwind tema ayarları  
**Ana Hatlar:** Next.js · TypeScript · Tailwind · Layout

**Çalışma ile İlgili Açıklamalar:**  
Next.js 14 App Router ile proje oluşturuldu. TypeScript ile tip güvenliği sağlandı. Tailwind CSS'te belediye mavi tonları tanımlandı. globals.css'te ortak buton ve form stilleri yazıldı. layout.tsx'te site metadata ve PWA manifest bağlantısı eklendi. npm run dev ile test edildi.

---

## 3. Gün — Header, Footer ve Menü

**Çalışma Konusu:** React bileşenleri ve responsive menü yapısı  
**Ana Hatlar:** Header/Footer · Mobil menü · usePathname · Navigasyon

**Çalışma ile İlgili Açıklamalar:**  
Header ve Footer React bileşenleri yazıldı. usePathname hook'u ile aktif sayfa menüde vurgulanıyor. Mobilde hamburger menü CSS transform ile açılıyor. Menü linkleri constants.ts'teki NAV_ITEMS dizisinden okunuyor.

---

## 4. Gün — Ana Sayfa ve Müdürlükler

**Çalışma Konusu:** Ana sayfa bileşenleri ve müdürlük modülü  
**Ana Hatlar:** Hero · E-hizmet kartları · API istatistik · Müdürlükler

**Çalışma ile İlgili Açıklamalar:**  
Hero, e-hizmet kartları ve istatistik bölümü oluşturuldu. HeroSearch arama API'sine istek atıyor. 13 müdürlük slug ile detay sayfasına yönlendiriliyor. StatsSection /api/basvurular?stats=1 endpoint'inden sayaçları çekiyor.

---

## 5. Gün — Veritabanı

**Çalışma Konusu:** Turso veritabanı, tablo tasarımı ve CRUD işlemleri  
**Ana Hatlar:** Turso/libSQL · Tablo şeması · db.ts · initDb()

**Çalışma ile İlgili Açıklamalar:**  
Turso (libSQL) bulut veritabanı kuruldu. basvurular, duyurular, randevular tabloları oluşturuldu. Harita şikayetleri için lat, lng, basvuru_tipi kolonları eklendi. db.ts'te CRUD fonksiyonları ve TypeScript interface'leri yazıldı. initDb() tabloları otomatik oluşturuyor.

---

## 6. Gün — Online Başvuru

**Çalışma Konusu:** Başvuru formu ve POST API endpoint'i  
**Ana Hatlar:** Form validasyon · API route · Vercel Blob · Başvuru no

**Çalışma ile İlgili Açıklamalar:**  
/basvuru formu POST /api/basvurular'a gönderiliyor. API TC ve zorunlu alan kontrolü yapıyor. Dosyalar Vercel Blob'a yükleniyor. Başarılı başvuruda otomatik ID ile numara veriliyor. Resend ile e-posta bildirimi gönderilebiliyor.

---

## 7. Gün — Sorgulama ve İstatistikler

**Çalışma Konusu:** Sorgulama sayfası ve istatistik API'si  
**Ana Hatlar:** GET API · Durum badge · getStats() · Sayaç animasyonu

**Çalışma ile İlgili Açıklamalar:**  
/sorgula sayfası GET /api/basvurular/[id] ile kayıt çekiyor. Durumlar renkli badge'lerle gösteriliyor. getStats() özet istatistik üretiyor. Ana sayfa sayaçları animasyonlu.

---

## 8. Gün — Duyurular ve İletişim

**Çalışma Konusu:** Duyuru modülü, iletişim formu ve arama API'si  
**Ana Hatlar:** Duyuru CRUD · İletişim API · SearchModal · Abonelik

**Çalışma ile İlgili Açıklamalar:**  
Duyurular veritabanından çekiliyor. İletişim formu POST /api/iletisim ile kaydediliyor. SearchModal Ctrl+K ile açılıyor, /api/arama endpoint'ine istek gidiyor. AbonelikForm e-posta kaydı alıyor.

---

## 9. Gün — Harita Şikayet

**Çalışma Konusu:** Leaflet harita entegrasyonu ve konum seçimi  
**Ana Hatlar:** Leaflet · react-leaflet · Şikayet tipleri · Sınır kontrolü

**Çalışma ile İlgili Açıklamalar:**  
Leaflet ve react-leaflet entegre edildi. Harita dynamic import ile istemci tarafında yükleniyor. HaritaSikayetWorkspace sol panel + harita düzeni kullanıyor. isInDortyolBounds() ile Dörtyol sınır kontrolü yapılıyor. Üç şikayet tipi: su, elektrik, bozuk yol.

---

## 10. Gün — Adres Otomasyonu

**Çalışma Konusu:** Koordinattan adrese çevirme servisi  
**Ana Hatlar:** Nominatim API · Reverse geocode · Otomatik adres · Fallback

**Çalışma ile İlgili Açıklamalar:**  
/api/geocode/reverse endpoint'i Nominatim API'sine koordinat gönderiyor. Mahalle ve cadde bilgisi birleştirilerek adres dolduruluyor. Nominatim yanıt vermezse Photon fallback devreye giriyor.

---

## 11. Gün — Yönetici Paneli

**Çalışma Konusu:** Admin giriş sistemi ve başvuru yönetimi  
**Ana Hatlar:** Session cookie · Login API · Durum güncelleme · CSV export

**Çalışma ile İlgili Açıklamalar:**  
/yonetici paneli POST /api/auth/login ile giriş yapıyor. Session cookie 24 saat geçerli. Başvuru durumu PATCH API ile güncelleniyor. CSV export UTF-8 BOM ile Excel uyumlu.

---

## 12. Gün — Dashboard ve CMS

**Çalışma Konusu:** İstatistik paneli, harita görünümü ve duyuru yönetimi  
**Ana Hatlar:** Dashboard stats · AdminMap · Kesinti katmanı · CMS

**Çalışma ile İlgili Açıklamalar:**  
getDashboardStats() tip ve mahalle dağılımı gösteriyor. AdminMap başvuruları Leaflet pin olarak gösteriyor. kesinti_bolgeleri ayrı katman. CMS ile duyuru CRUD yapılıyor.

---

## 13. Gün — OTP, Randevu, Chatbot

**Çalışma Konusu:** E-posta doğrulama, randevu modülü ve yardım asistanı  
**Ana Hatlar:** OTP API · Randevu · ChatWidget · KVKK sayfaları

**Çalışma ile İlgili Açıklamalar:**  
/api/otp/send 6 haneli kod üretip e-posta gönderiyor (10 dk geçerli). Randevu modülü randevular tablosuna kayıt oluşturuyor. ChatWidget FAQ + OpenAI desteği kullanıyor. KVKK sayfaları eklendi.

---

## 14. Gün — Mobil ve Demo Veri

**Çalışma Konusu:** Responsive tasarım, ana sayfa güncelleme ve test verileri  
**Ana Hatlar:** Mobil UI · Hero · seed-data · memory-store · Harita akışı

**Çalışma ile İlgili Açıklamalar:**  
Mobil menü ve bottom sheet asistan eklendi. seed-data.ts ~80 demo başvuru üretiyor. memory-store.ts Turso yokken bellek deposu kullanıyor. Harita akışı sessionStorage ile ayrı form sayfasına yönlendiriyor.

---

## 15. Gün — Test, Deploy ve Sunum

**Çalışma Konusu:** Production deploy, test ve staj sunumu  
**Ana Hatlar:** Vercel · Env ayarları · PWA · Demo sunumu

**Çalışma ile İlgili Açıklamalar:**  
GitHub + Vercel ile deploy yapıldı. TURSO, ADMIN_SECRET, BLOB, RESEND env'leri tanımlandı. Tüm akışlar test edildi. manifest.json ile PWA ayarlandı. Canlı demo sunumu yapıldı.

---

# Quiz İçin Hızlı Özet

| Konu | Bilgi |
|------|-------|
| Proje | e-Belediye — Dörtyol Belediyesi vatandaş portalı |
| Framework | Next.js 14 (App Router) + React + TypeScript |
| Stil | Tailwind CSS |
| Veritabanı | Turso (libSQL) — bulut SQLite |
| Harita | Leaflet + react-leaflet + OpenStreetMap |
| Deploy | Vercel + GitHub |
| Dosya depolama | Vercel Blob |
| E-posta | Resend |
| Şikayet tipleri | Su kesintisi, elektrik arızası, bozuk yol |
| Başvuru durumları | İncelemede, Devam Ediyor, Çözüldü, Reddedildi |
| OTP | 6 haneli kod, 10 dakika geçerli |
| Demo veri | ~80 başvuru, 20 randevu (seed-data.ts) |
| Admin panel | /yonetici — session cookie ile giriş |
| Geocoding | Nominatim (Photon fallback) |
| Mobil | Responsive + PWA manifest |
