import PageHeader from "@/components/PageHeader";
import { BELEDIYE_ADI } from "@/lib/constants";

export const metadata = {
  title: "KVKK Aydınlatma Metni",
  description: "Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni",
};

export default function KvkkPage() {
  return (
    <>
      <div className="site-container pt-8">
        <PageHeader
          title="KVKK Aydınlatma Metni"
          subtitle="6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında bilgilendirme"
          breadcrumbs={[{ label: "KVKK" }]}
        />
      </div>
      <section className="content-section pt-0">
        <div className="max-w-3xl info-card prose prose-sm max-w-none text-gray-700">
          <h2 className="text-lg font-semibold text-gray-900">Veri Sorumlusu</h2>
          <p>
            {BELEDIYE_ADI} olarak, kişisel verileriniz 6698 sayılı Kişisel Verilerin Korunması
            Kanunu (&quot;KVKK&quot;) kapsamında veri sorumlusu sıfatıyla işlenmektedir.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-6">İşlenen Kişisel Veriler</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Kimlik bilgileri (TC kimlik numarası, ad soyad)</li>
            <li>İletişim bilgileri (telefon, e-posta, adres)</li>
            <li>Başvuru ve talep içerikleri</li>
            <li>Konum bilgileri (harita ile şikayet bildirimlerinde)</li>
            <li>Yüklenen belge ve fotoğraflar</li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-900 mt-6">İşleme Amaçları</h2>
          <p>
            Kişisel verileriniz; vatandaş başvurularının alınması, değerlendirilmesi ve sonuçlandırılması,
            randevu hizmetlerinin yürütülmesi, bilgilendirme yapılması ve yasal yükümlülüklerin yerine
            getirilmesi amaçlarıyla işlenmektedir.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-6">Hukuki Sebep</h2>
          <p>
            Kişisel verileriniz; KVKK&apos;nın 5. ve 6. maddelerinde belirtilen hukuki sebeplere dayanılarak,
            açık rızanız veya kanuni yükümlülüklerimiz çerçevesinde işlenmektedir.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-6">Haklarınız</h2>
          <p>KVKK&apos;nın 11. maddesi kapsamında aşağıdaki haklara sahipsiniz:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>İşlenmişse buna ilişkin bilgi talep etme</li>
            <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
            <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
            <li>KVKK&apos;da öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme</li>
          </ul>

          <p className="mt-6 text-sm text-gray-500">
            Başvurularınız için{" "}
            <a href="/iletisim" className="text-primary hover:underline">İletişim</a>{" "}
            sayfamızdan bize ulaşabilirsiniz.
          </p>
        </div>
      </section>
    </>
  );
}
