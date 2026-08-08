import PageHeader from "@/components/PageHeader";
import { BELEDIYE_ADI } from "@/lib/constants";

export const metadata = {
  title: "Gizlilik Politikası",
  description: "e-Belediye portalı gizlilik politikası",
};

export default function GizlilikPage() {
  return (
    <>
      <div className="site-container pt-8">
        <PageHeader
          title="Gizlilik Politikası"
          subtitle="e-Belediye portalında kişisel verilerinizin korunması"
          breadcrumbs={[{ label: "Gizlilik Politikası" }]}
        />
      </div>
      <section className="content-section pt-0">
        <div className="max-w-3xl info-card prose prose-sm max-w-none text-gray-700">
          <p>
            {BELEDIYE_ADI} e-Belediye portalı, vatandaşlarımızın gizliliğine saygı duyar ve kişisel
            verilerinizi korumayı taahhüt eder.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-6">Toplanan Bilgiler</h2>
          <p>
            Portal üzerinden başvuru, randevu, iletişim ve sorgulama hizmetlerini kullanırken
            girdiğiniz bilgiler güvenli sunucularda saklanır. Oturum çerezleri yalnızca yönetici
            paneli girişi için kullanılır.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-6">Veri Güvenliği</h2>
          <p>
            Verileriniz şifreli bağlantı (HTTPS) üzerinden iletilir. Veritabanı erişimi yetkilendirilmiş
            personelle sınırlıdır. OTP doğrulama kodları 10 dakika geçerlidir ve tek kullanımlıktır.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-6">Üçüncü Taraf Hizmetler</h2>
          <p>
            E-posta bildirimleri (Resend), SMS bildirimleri (Twilio), dosya depolama (Vercel Blob) ve
            harita hizmetleri gibi üçüncü taraf servisler yalnızca hizmet sunumu amacıyla kullanılır.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-6">Çerezler</h2>
          <p>
            Portal, temel işlevsellik için gerekli oturum çerezlerini kullanır. Reklam veya izleme
            amaçlı çerez kullanılmamaktadır.
          </p>

          <p className="mt-6 text-sm text-gray-500">
            Detaylı bilgi için{" "}
            <a href="/kvkk" className="text-primary hover:underline">KVKK Aydınlatma Metni</a>
            {" "}sayfamıza bakınız.
          </p>
        </div>
      </section>
    </>
  );
}
