# e-Belediye - T.C. Doertyol Belediyesi

Next.js + Turso ile Vatandas Basvuru ve Yonetim Sistemi

## Ozellikler

- Ana Sayfa (canli istatistikler, duyurular, e-hizmetler)
- Online Basvuru + dosya yukleme (Vercel Blob)
- Basvuru Sorgulama
- Mudurlukler (arama + detay)
- Duyurular sayfasi + CMS yonetimi
- Baskan & Meclis
- Iletisim formu + Google Maps
- Site ici arama (Ctrl+K)
- Canli destek chatbot (SSS)
- E-posta bildirimi (Resend) + SMS (Twilio, istege bagli)

## Vercel Deploy (ONEMLI)

Site calismasi icin Turso veritabani ZORUNLUDUR:

1. https://turso.tech adresinde ucretsiz DB olusturun
2. Vercel > Project > Settings > Environment Variables:
   - TURSO_DATABASE_URL = libsql://xxx.turso.io
   - TURSO_AUTH_TOKEN = token
3. (Istege bagli) Resend, Blob, Twilio anahtarlari - bkz. .env.example
4. Redeploy edin

## Yerel Gelistirme

npm install && npm run dev
