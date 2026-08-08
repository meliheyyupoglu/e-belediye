import PageHeader from "@/components/PageHeader";
import { BELEDIYE_ADI } from "@/lib/constants";

export const metadata = {
  title: "Kullanım Koşulları",
  description: "e-Belediye portalı kullanım koşulları",
};

export default function KullanimKosullariPage() {
  return (
    <>
      <div className="site-container pt-8">
        <PageHeader
          title="Kullanım Koşulları"
          subtitle="e-Belediye portalını kullanırken uymanız gereken kurallar"
          breadcrumbs={[{ label: "Kullanım Koşulları" }]}
        />
      </div>
      <section className="content-section pt-0">
        <div className="max-w-3xl info-card prose prose-sm max-w-none text-gray-700">
          <p>
            {BELEDIYE_ADI} e-Belediye portalını kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-6">Genel Hükümler</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Portal yalnızca yasal amaçlarla kullanılmalıdır.</li>
            <li>Başvurularda doğru ve güncel bilgi vermekle yükümlüsünüz.</li>
            <li>Sahte, yanıltıcı veya kötü niyetli başvurular reddedilir ve yasal işlem uygulanabilir.</li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-900 mt-6">Başvuru ve Şikayetler</h2>
          <p>
            Online başvurular belediye kayıtlarına alınır; başvuru numarası ile takip edilebilir.
            Harita ile yapılan şikayetlerde konum bilgisi Dörtyol ilçe sınırları içinde olmalıdır.
            Bozuk yol bildirimlerinde fotoğraf yüklenmesi zorunludur.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-6">Sorumluluk Sınırı</h2>
          <p>
            Belediyemiz, teknik arızalar veya bakım çalışmaları nedeniyle portal hizmetlerinde
            geçici kesintiler yaşanabileceğini bildirir. Acil durumlar için 444 7 712 hattını arayınız.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-6">Fikri Mülkiyet</h2>
          <p>
            Portal içeriği, tasarımı ve yazılımı {BELEDIYE_ADI}&apos;ne aittir. İzinsiz kopyalanamaz
            veya ticari amaçla kullanılamaz.
          </p>

          <p className="mt-6 text-sm text-gray-500">
            Son güncelleme: Ağustos 2026
          </p>
        </div>
      </section>
    </>
  );
}
