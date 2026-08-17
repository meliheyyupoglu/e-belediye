# STAJ DEFTERİ — e-Belediye Projesi (10 Gün)

**Kurum:** T.C. Dörtyol Belediyesi — Bilgi İşlem Müdürlüğü  
**Proje:** e-Belediye Vatandaş Başvuru ve Yönetim Sistemi  
**Staj Süresi:** 10 İş Günü  

---

## 1. Gün — Oryantasyon ve Proje Kurulumu

**Çalışma Konusu:** Belediye tanıtımı, proje planlaması ve site kurulumu  
**Ana Hatlar:** Ekip tanıtımı · Proje hedefleri · Site altyapısı · İlk test

**Çalışma ile İlgili Açıklamalar:**

Stajın ilk gününde Bilgi İşlem Müdürlüğü'ne gittim, ekiple tanıştım. Görevim vatandaşların internetten başvuru yapabileceği, başvurularını takip edebileceği ve harita üzerinden şikayet iletebileceği bir e-Belediye sitesi geliştirmekti. Belediyenin mevcut sitesini inceledim; müdürlükleri, duyuruları ve hizmetleri not aldım. Eski deneme projesi yerine daha düzenli bir web sitesi altyapısı kurdum. Belediye renklerine uygun görünüm ayarlarını yaptım, ortak buton ve form stillerini hazırladım. Site başlığını ve mobil uyumlu yapıyı ayarladım. Bilgisayarımda çalıştırıp ana sayfanın düzgün açıldığını kontrol ettim.

---

## 2. Gün — Üst Menü, Alt Bilgi ve Ana Sayfa

**Çalışma Konusu:** Site iskeleti, menü yapısı ve ana sayfa düzeni  
**Ana Hatlar:** Üst menü · Alt bilgi · Mobil menü · Hizmet kartları · Müdürlükler

**Çalışma ile İlgili Açıklamalar:**

Sitenin her sayfasında görünecek üst menü ve alt bilgi bölümünü hazırladım. Kullanıcı hangi sayfadaysa menüde o bağlantıyı belirgin gösterdim. Telefonda yer kazanmak için üç çizgili mobil menü ekledim; tıklayınca sağdan açılıyor. Menü linklerini tek bir listeden çektim, yeni sayfa eklemek kolay olsun diye böyle yaptım. Ana sayfada tanıtım alanı, hizmet kartları ve canlı istatistik bölümünü oluşturdum. Site içi arama kutusunu ekledim. Müdürlükler sayfasında 13 müdürlüğü listeledim, tıklayınca detay sayfasına gidiyor.

---

## 3. Gün — Veritabanı ve Online Başvuru

**Çalışma Konusu:** Veri kaydı, başvuru formu ve dosya ekleme  
**Ana Hatlar:** Bulut veritabanı · Başvuru formu · Alan kontrolü · Dosya yükleme

**Çalışma ile İlgili Açıklamalar:**

Başvuruların kaybolmaması için internet üzerinde çalışan bir veritabanı kurdum. Başvuru, duyuru, randevu ve doğrulama kodu kayıtları için ayrı tablolar oluşturdum. Harita şikayetlerinde konum ve adres bilgisi de saklansın diye ek alanlar ekledim. Veritabanına kayıt ekleme, okuma ve güncelleme işlemlerini yazdım. Başvuru sayfasına TC, ad soyad, telefon, departman, konu ve açıklama alanlarını koydum. Form gönderilince bilgileri kontrol ediyorum; eksik veya hatalıysa uyarı veriyorum. Dosya eklenmişse buluta yükleyip bağlantısını kaydediyorum. Başvuru başarılı olunca otomatik numara üretip vatandaşa gösteriyorum.

---

## 4. Gün — Başvuru Sorgulama ve Duyurular

**Çalışma Konusu:** Başvuru takibi, sayaçlar ve duyuru sayfaları  
**Ana Hatlar:** Sorgulama · Durum etiketleri · Ana sayfa sayaçları · Arama · Duyurular

**Çalışma ile İlgili Açıklamalar:**

Vatandaşlar başvuru numarasıyla takip edebilsin diye sorgulama sayfasını geliştirdim. Numara girilince kaydı bulup durum, departman, konu, tarih ve varsa konum bilgisini gösteriyorum. Durumları renkli etiketlerle ayırdım: İncelemede turuncu, Devam Ediyor kırmızı, Çözüldü yeşil. Ana sayfadaki sayaçlar veritabanındaki gerçek sayıları gösteriyor, yüklenirken animasyonlu artıyor. Duyuru listeleme ve detay sayfalarını veritabanına bağladım. Klavyeden kısayolla açılan arama penceresini ekledim; yazdıkça site içinde arama yapılıyor.

---

## 5. Gün — Harita Tabanlı Şikayet Sistemi

**Çalışma Konusu:** Harita ekranı ve konum seçimi  
**Ana Hatlar:** Harita · Şikayet türleri · Dörtyol sınırı · Başvuru yönlendirme

**Çalışma ile İlgili Açıklamalar:**

Su kesintisi, elektrik arızası ve bozuk yol şikayetleri için harita özelliğini siteye ekledim. Harita ekranını hazırladım; solda konum seçimi ve şikayet türü, sağda açık kaynaklı harita görünüyor. Üç şikayet tipini tanımladım. Vatandaş haritada Dörtyol dışına tıklarsa uyarı veriyorum, sadece ilçe içindeki noktalar kabul ediliyor. Konum ve şikayet türü seçilince bilgileri geçici olarak saklayıp ayrı bir başvuru sayfasına yönlendirdim. Böylece harita ekranı sade kalıyor, form ayrı sayfada dolduruluyor.

---

## 6. Gün — Otomatik Adres Bulma

**Çalışma Konusu:** Haritadan seçilen noktanın adrese çevrilmesi  
**Ana Hatlar:** Koordinat · Adres doldurma · Yedek servis · İletişim formu

**Çalışma ile İlgili Açıklamalar:**

Haritaya tıklayınca seçilen noktanın adresinin otomatik yazılması için bir servis bağladım. Enlem ve boylam bilgisini dış bir adres servisine gönderiyorum, dönen cevaptan mahalle ve cadde bilgisini birleştirip adres alanını dolduruyorum. Su ve elektrik şikayetlerinde daha ayrıntılı, bozuk yol şikayetlerinde daha kısa adres gösteriyorum. Bir servis cevap vermezse yedek servise geçiyorum. Adres alınırken ekranda yükleniyor yazısı çıkıyor, vatandaş isterse adresi elle de düzenleyebiliyor. İletişim formunu ve e-posta abonelik bölümünü de bu gün tamamladım.

---

## 7. Gün — Yönetici Paneli ve Giriş Sistemi

**Çalışma Konusu:** Personel girişi ve başvuru yönetimi  
**Ana Hatlar:** Şifreli giriş · Başvuru listesi · Durum güncelleme · Excel aktarımı

**Çalışma ile İlgili Açıklamalar:**

Belediye personeli için şifre korumalı yönetici panelini yaptım. Doğru kullanıcı adı ve şifre girilince oturum açılıyor, yaklaşık 24 saat geçerli kalıyor. Panele her girişte yetki kontrolü yapıyorum. Başvuruları listeledim, departmana göre filtreleyebiliyorum. Durum, not ve atanan personel bilgisini güncelleyebiliyorum. Listeyi Excel'e aktarma özelliğini ekledim; Türkçe karakterler bozulmasın diye uygun dosya formatını kullandım. Yönetici girişini ayrı bir sayfaya taşıdım.

---

## 8. Gün — Özet Ekran, Duyuru Yönetimi ve Ek Hizmetler

**Çalışma Konusu:** Yönetici özeti, harita görünümü, randevu ve yardım asistanı  
**Ana Hatlar:** Özet ekran · Harita pinleri · Duyuru yönetimi · Doğrulama kodu · Randevu

**Çalışma ile İlgili Açıklamalar:**

Yönetici paneline özet ekran ekledim; toplam başvuru, durum dağılımı ve şikayet türlerine göre sayıları gösteriyorum. Konum bilgisi olan başvuruları harita üzerinde işaret olarak gösterdim, renk şikayet türüne göre değişiyor. Personelin duyuru ekleyip düzenleyebileceği bir yönetim bölümü yaptım. Başvuru geçmişine bakmak için e-posta doğrulama kodu sistemi kurdum; 6 haneli kod gönderiliyor, doğrulandıktan sonra geçmiş başvurular görünüyor. Randevu alma modülünü ve sitedeki yardım asistanını da ekledim. KVKK ve gizlilik sayfalarını yazdım.

---

## 9. Gün — Karanlık Mod, Bildirim ve Vatandaş Kayıt

**Çalışma Konusu:** Tema seçimi, bildirimler ve üyelik sistemi  
**Ana Hatlar:** Karanlık mod · Bildirim zili · Kayıt ol · Giriş yap

**Çalışma ile İlgili Açıklamalar:**

Kullanıcıların istediğinde karanlık moda geçebilmesi için tema sistemini kurdum. Tercih tarayıcıda saklanıyor, site varsayılan olarak açık modda açılıyor. Üst menüye ay ve güneş ikonlu geçiş düğmesi ekledim. Kart, form ve menü renklerini karanlık moda uygun hale getirdim. Başvuru durumu değişince vatandaşa site içi bildirim düşsün diye bildirim sistemini kurdum; üst menüde zil ikonu ve okunmamış sayısı görünüyor. Vatandaşların hesap açıp giriş yapabilmesi için kayıt ve giriş sayfalarını hazırladım. Şifreler güvenli şekilde saklanıyor. İşlem sonrası kısa bilgi mesajları da gösteriliyor.

---

## 10. Gün — Test, Yayın ve Proje Sunumu

**Çalışma Konusu:** Mobil uyum, test verisi, internete yükleme ve sunum  
**Ana Hatlar:** Mobil görünüm · Test verisi · Tüm özellikleri deneme · Canlı sunum

**Çalışma ile İlgili Açıklamalar:**

Mobil görünümü iyileştirdim; kaydırmalı yan menü ve kart tabanlı meclis listesi ekledim. Panel boş görünmesin diye yaklaşık 80 örnek başvuru ve 20 randevu üreten test verisi hazırladım. Veritabanı bağlantısı olmasa bile site çalışsın diye geçici bellek desteği ekledim. Başvuru, sorgulama, harita şikayeti, karanlık mod, bildirim ve kayıt-giriş akışlarını baştan sona denedim. Projeyi internete yükleyip ayarlarını tamamladım. Telefona ana ekrana eklenebilir hale getirdim. Staj sorumlusuna canlı demo ile projeyi gösterdim ve 10 günlük staj defterimi teslim ettim.

---

**Stajyer:** .............................................  
**Staj Sorumlusu:** .............................................  
**Tarih:** .............................................
