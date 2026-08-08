export const BELEDIYE_ILETISIM = {
  "adres": "Numune Evler Mahallesi İstasyon Caddesi No: 2, 31600 Dörtyol/Hatay",
  "telefon": "444 7 712",
  "telefon_santral": "0 (326) 712 3 712"
} as const;

/** WhatsApp wa.me linki için uluslararası format (90XXXXXXXXXX) */
export function belediyeWhatsappNumber(): string {
  const digits = BELEDIYE_ILETISIM.telefon_santral.replace(/\D/g, "");
  if (digits.startsWith("0")) return `90${digits.slice(1)}`;
  return `90${digits}`;
}

export interface MudurlukBilgi {
  mudur: string;
  telefon_dahili: string | null;
  aciklama: string;
  gorevler: string[];
  kaynak: string;
}

export const MUDURLUK_BILGILERI: Record<string, MudurlukBilgi> = {
  "Fen İşleri Müdürlüğü": {
    "mudur": "Abdurrahman ERPAK",
    "telefon_dahili": "1043",
    "aciklama": "Dörtyol Belediyesi sınırları içerisinde yürürlükteki İmar Planlarına uygun olarak sorumluluk alanı dâhilinde yeni yolların yapılması, mevcut yolların onarılması, Belediye'nin diğer birimleri ile işbirliği içerisinde kaçak yapıların yıkılması için gerekli araç-gereç ve ekipmanı sağlamak, hafriyat işlerinin yürütülmesini takip etmek, vatandaşların istek ve şikâyetlerini alıp değerlendirmek ve sonucunu ilgili kişi ve kurumlara iletmek, fiziki çevre düzenlemeleri (bordur, yaya yolu vb.) ile ilgili işleri yürütmek, ilçenin altyapı ve yatırımlarının amaca ve onaylanan planlara uygun olarak yapılmasını koordine etmek, bölgedeki molozların toplanması ve döküm yerlerine nakledilmesi, sunulan hizmetlerle ilgili ve belediyenin diğer birimlerin ihale yoluyla yapılacak işlerin proje ve ihale işlemlerini, hak edişleri ve ödemelerini takip etmekten kontrollük görevini yürütmek, hizmetlerde kullanılan Dörtyol Belediyesine ait tüm araç ve iş makinelerinin onarım tamir ve bakımlarını yapmak veya yaptırmaktır.",
    "gorevler": [
      "İlçe sınırları içinde alt yapı ve üst yapı tesislerinin tesisi, denetlenmesi ve bakım-onarımı",
      "İmar planlarına uygun yol, bulvar, meydan ve yaya yollarının yapımı ile onarımı",
      "Altyapı hizmetlerinin planlanması, koordinasyonu ve yatırım programının uygulanması",
      "Kaçak yapı yıkımları, hafriyat takibi ve moloz toplama-nakil işlemleri",
      "Belediye araç ve iş makinelerinin bakım, onarım ve işletilmesi",
      "5 yıllık yatırım programı hazırlama ve diğer yatırımcı kuruluşlarla koordinasyon"
    ],
    "kaynak": "https://www.dortyol.bel.tr/mudurluk/fen-isleri-mudurlugu"
  },
  "İmar ve Şehircilik Müdürlüğü": {
    "mudur": "Yılmaz SEFEROĞLU",
    "telefon_dahili": "1031",
    "aciklama": "Dörtyol Belediye Başkanlığı İmar ve Şehircilik Müdürlüğü; ilçe sınırları içerisinde imar ve planlama çalışmalarının aksamadan yürütülmesini sağlamak, imar planlarının yapılması, hazırlanması, revizyonu ve tadilatlarının yapılması, imar uygulama ile ilgili imar durumu, istikamet rölevesi, kot-kesit tanzimi, mimari, statik, ısı yalıtım, elektrik ve mekanik projelerinin onaylanması, inşaat ruhsatlarının düzenlenmesi, iskan işlemleri, yapı denetim ve kontrol hizmetleri ile ruhsata aykırı yapılar hakkında yasal işlemlerin takibinden sorumludur.",
    "gorevler": [
      "İmar planlarının hazırlanması, revizyonu ve imar uygulama işlemleri",
      "İmar durumu, istikamet rölevesi ve proje onay işlemleri",
      "İnşaat ruhsatı düzenleme, iskan (yapı kullanma izni) ve vize işlemleri",
      "Yapı denetim ve kontrol hizmetleri ile ruhsatsız/ruhsata aykırı yapı takibi",
      "Kaçak yapılar hakkında yasal işlem ve yıkım süreçlerinin yürütülmesi",
      "İmar hizmetlerine ilişkin resmi ücret ve harçların tahakkuku"
    ],
    "kaynak": "https://www.dortyol.bel.tr/mudurluk/imar-ve-sehircilik-mudurlugu"
  },
  "Park ve Bahçeler Müdürlüğü": {
    "mudur": "Şener ŞENTÜRK",
    "telefon_dahili": "2101",
    "aciklama": "Sorumluluk alanı içerisinde bulunan mevcut park ve yeşil alanların; bakım, onarım ve iyileştirme çalışmaları yaparak Avrupa standartları seviyesine getirmek. Dörtyol ilçesi genelinde yeni yeşil alanların ve parkların kazandırılmasını sağlamak. İlçe geneli sorumluluk sahasında bulunan parkların, yeşil alanların, yolların, kaldırımların ve kamu kurum ve kuruluşlarının çevre düzenlemesi, ağaç budaması ve kesimi, çim biçimi gibi görevleri yerine getirmektir.",
    "gorevler": [
      "Park ve yeşil alanların bakım, onarım ve iyileştirme çalışmaları",
      "Yeni park ve yeşil alanların tesis edilmesi",
      "Cadde, sokak ve meydanlarda ağaçlandırma ve peyzaj düzenlemeleri",
      "Ağaç budama, kesim ve yeşil alan sulama-gübreleme-ilaçlama işlemleri",
      "Çocuk oyun alanları, yürüyüş yolları ve spor alanlarının bakımı",
      "Kamu kurum ve kuruluşlarına çevre düzenlemesi hizmetleri"
    ],
    "kaynak": "https://www.dortyol.bel.tr/mudurluk/park-ve-bahceler-mudurlugu"
  },
  "Zabıta Müdürlüğü": {
    "mudur": "Ali AVAN",
    "telefon_dahili": "3001",
    "aciklama": "Zabıta, görevlendirildikleri bölgede kamu düzenini sağlamak, huzuru tesis etmek ve halk sağlığını korumak ile görevlidir. Zabıtaların bazıları sabit bazıları ise gezici olarak denetim yapar. Gıda malzemeleri üreten, satan ya da dağıtan işyerlerinin denetimleri, ruhsatsız iş yerlerinin tespiti, semt pazarı düzeni, seyyar satıcı kontrolü ve izinsiz ilan-afiş denetimleri müdürlüğün temel görevleri arasındadır.",
    "gorevler": [
      "Kamu düzeni ve huzurun sağlanması, halk sağlığının korunması",
      "Gıda işyerlerinin rutin ve baskın denetimleri",
      "Ruhsatsız iş yerlerinin tespiti ve gerekli işlemlerin uygulanması",
      "Semt pazarı ve seyyar satıcı denetimleri",
      "İzinsiz ilan ve afiş asanların tespiti ve yaptırım uygulanması",
      "Halk sağlığına tehdit oluşturan işlemlerin durdurulması"
    ],
    "kaynak": "https://www.dortyol.bel.tr/mudurluk/zabita-mudurlugu"
  },
  "Temizlik İşleri Müdürlüğü": {
    "mudur": "Mehmet SOYLU",
    "telefon_dahili": "2011",
    "aciklama": "Dörtyol Belediyesi sınırları içerisinde sağlıklı bir yaşam ve temiz bir çevre oluşturabilmesi için belediye sınırları içinde temizlik çalışmalarının aksamadan yürütülmesi, çöplerin toplanması ve çöp toplama alanlarına nakledilmesi, cadde ve sokakların süpürülmesi ve yıkanması, pazaryerlerinin yıkanması ve dezenfeksiyonu işlemlerinin kontrol ve takibinden sorumludur.",
    "gorevler": [
      "Belediye sınırları içinde çöp toplama ve nakil işlemleri",
      "Cadde, sokak ve meydanların süpürülmesi ve yıkanması",
      "Pazaryerlerinin yıkanması ve dezenfeksiyonu",
      "Ambalaj atıklarının ayrı toplanması ve geri dönüşüm planının uygulanması",
      "Temizlik ihalelerinin hazırlanması, takibi ve denetimi",
      "Vatandaş şikâyetlerinin değerlendirilmesi ve sonuçlandırılması"
    ],
    "kaynak": "https://www.dortyol.bel.tr/mudurluk/temizlik-isleri-mudurlugu"
  },
  "Bilgi İşlem Müdürlüğü": {
    "mudur": "Ömer Yaşar GÜNAL",
    "telefon_dahili": "1453",
    "aciklama": "Bilgi İşlem Müdürlüğü; Belediyenin orta ve uzun vadeli bilgi işlem politikalarını belirlemek, bilişim sistemlerini kurmak, işletmek, bakım ve onarımlarını yapmak, bilişim hizmetlerini ilgili birimlerle birlikte yürütmek, bilgi işlem standartlarının belirlenmesi ve gelişiminin izlenmesi, gelişen bilişim teknolojisinin belediye bünyesine aktarımı konularında çalışmalar yürütmektedir.",
    "gorevler": [
      "Belediye bilişim sistemlerinin kurulması, işletilmesi ve bakım-onarımı",
      "Web sitesi, elektronik portal ve Kent Bilgi Sistemi yönetimi",
      "Bilgi güvenliği politikalarının planlanması ve uygulanması",
      "Ağ (WAN, LAN) altyapısının yönetimi ve kapasite planlaması",
      "Kullanıcı eğitimleri ve teknik destek hizmetlerinin koordinasyonu",
      "Bilişim projelerinin hazırlanması ve birimler arası koordinasyon"
    ],
    "kaynak": "https://www.dortyol.bel.tr/mudurluk/bilgi-islem-mudurlugu"
  },
  "Basın Yayın ve Halkla İlişkiler Müdürlüğü": {
    "mudur": "Burhan TUTU",
    "telefon_dahili": "1111",
    "aciklama": "Katılımcı ve şeffaf bir yönetim anlayışı ile adalet ve dürüstlükten ödün vermeme kararlılığı içerisinde, kaynakları planlı, programlı, etkili ve verimli kullanarak, kent ve kent sakinlerinin yerel ortak ihtiyaçlarını gidermek suretiyle, yüksek kalite standartlarında yaşam düzeyi sunarak insanımızı tarihi, kültürel ve ekonomik zenginliklere kavuşturmaktır.",
    "gorevler": [
      "Belediye faaliyetleri hakkında kamuoyunun bilgilendirilmesi",
      "Medya organlarıyla ilişkiler ve basın takibi-arşivleme",
      "Bülten, afiş, pankart, web, SMS ve e-posta ile iletişim",
      "Vatandaş şikâyet, öneri ve taleplerinin ilgili birimlere iletilmesi",
      "Bilgi Edinme Hakkı Kanunu kapsamındaki başvuruların yönetimi",
      "Belediye iletişim panolarının ve görsel materyallerin hazırlanması"
    ],
    "kaynak": "https://www.dortyol.bel.tr/mudurluk/basin-yayin-ve-halkla-iliskiler-mudurlugu"
  },
  "Afet İşleri ve Risk Yönetimi Müdürlüğü": {
    "mudur": "Yaşar AKYÜZ",
    "telefon_dahili": null,
    "aciklama": "Bu yönetmelik; Dörtyol ilçesindeki afet ile ilgili hizmetlerin etkin bir şekilde gerçekleştirilmesi amacıyla afet öncesinde hazırlık ve risk yönetimi, afet sırasında müdahale ve kriz yönetimi, afet sonrasında iyileştirme faaliyetleri için gerekli önlemlerin alınması, afetlere dirençli yerleşim yerlerinin oluşturulması ve afetlerin zararlarının azaltılmasına yönelik çalışmaların yapılması ile birimler arası koordinasyonun sağlanması ve afetlere yönelik politikaların üretilmesi ile uygulanmasını kapsar.",
    "gorevler": [
      "Afet öncesi hazırlık, risk yönetimi ve risk azaltma planlarının hazırlanması",
      "Afet sırasında arama-kurtarma faaliyetlerinin sevk ve idaresi",
      "AFAD, ilgili kurumlar ve gönüllü kuruluşlarla koordinasyon",
      "Afet eğitimleri, bilgilendirme faaliyetleri ve toplumsal farkındalık çalışmaları",
      "Kritik yapıların risk tespiti ve yapı envanteri oluşturulması",
      "Afet sonrası iyileştirme, raporlama ve insani yardım lojistiği"
    ],
    "kaynak": "https://www.dortyol.bel.tr/mudurluk/afet-isleri-ve-risk-yonetimi-mudurlugu"
  },
  "Emlak ve İstimlak Müdürlüğü": {
    "mudur": "Murat ALKAN",
    "telefon_dahili": "1080",
    "aciklama": "Emlak ve İstimlak Müdürlüğü; belediyeye ait taşınmaz malların kayıtlarını düzenli bir şekilde tutmak, takip ve kontrolünü sağlamak, taşınmazları fuzuli işgalden korumak, kamulaştırma işlemlerini yürütmek, arsa tahsis ve kentsel dönüşüm faaliyetlerini gerçekleştirmek, belediye mülklerinin satış, kira, trampa ve değerlendirme işlemlerini yürütmekten sorumludur.",
    "gorevler": [
      "Belediyeye ait taşınmaz malların kayıt, takip ve kontrolü",
      "Kamulaştırma iş ve işlemlerinin yürütülmesi",
      "Taşınmaz satış, kira, trampa ve kat karşılığı değerlendirme işlemleri",
      "Arsa tahsisi ve kentsel dönüşüm faaliyetleri",
      "Belediye lojman ve tesislerinin bakım, tahsis ve tahliye işlemleri",
      "Fuzuli işgal tespiti ve ecrimisil bedellerinin alınması"
    ],
    "kaynak": "https://www.dortyol.bel.tr/mudurluk/emlak-ve-istimlak-mudurlugu"
  },
  "Su ve Kanalizasyon İşleri": {
    "mudur": "Abdurrahman ERPAK",
    "telefon_dahili": "1043",
    "aciklama": "Su ve kanalizasyon altyapı hizmetleri Fen İşleri Müdürlüğü kapsamında yürütülmektedir. Fen İşleri Müdürlüğü; ilçenin alt yapı ve yatırımlarının amaca ve onaylanan planlara uygun olarak yapılmasını koordine etmek, kent donatılarının kurulması, alt yapı hizmetlerinin tesisi ve denetlenmesi, yol, meydan, bulvar ve yaya yollarının çağın gereklerine ve standartlarına uygun yapılması görevleri arasında su ve kanalizasyon altyapı çalışmaları da yer almaktadır.",
    "gorevler": [
      "Su ve kanalizasyon altyapı tesislerinin planlanması ve koordinasyonu",
      "Alt yapı hizmetlerinin tesisi, denetlenmesi ve bakım-onarımı",
      "Altyapı yatırımlarının onaylanan planlara uygun yürütülmesi",
      "Altyapı imalat malzemelerinin temini, bakımı ve depolanması",
      "Diğer yatırımcı kuruluşlarla altyapı koordinasyonu",
      "5 yıllık yatırım programı kapsamında altyapı projelerinin uygulanması"
    ],
    "kaynak": "https://www.dortyol.bel.tr/mudurluk/fen-isleri-mudurlugu"
  },
  "Kültür Sanat ve Sosyal İşler Müdürlüğü": {
    "mudur": "Sinan ERDEM",
    "telefon_dahili": "2090",
    "aciklama": "Belediyemiz Kültür ve Sosyal İşler Müdürlüğü bünyesinde Kuzuculu, Altınçağ, Ocaklı, Çaylı, Yeşilköy, Yeniyurt, Kışlalar, Karakese ve Özerli mahallelerinde faaliyet gösteren AÇEM (Anne Çocuk Eğitim Merkezi) merkezlerinde bayanlara kurs ve okul öncesi çocuklara oyun odası eğitimi verilmektedir. Karahasan Paşa Sosyal Tesisinde düğün ve nikah hizmeti sunulmakta; Özerli mahallesindeki İlk Kurşun Müzesi ve Atatürk Evi hafta içi ve hafta sonu 08:00-17:00 saatleri arasında ziyarete açıktır.",
    "gorevler": [
      "Kültürel, sanatsal ve sosyal etkinliklerin düzenlenmesi",
      "AÇEM merkezlerinde anne-çocuk eğitim programlarının yürütülmesi",
      "Evlendirme hizmetleri ve nikâh salonu organizasyonları",
      "Müze ve kütüphane hizmetlerinin yönetimi",
      "Engelli vatandaşlara yönelik rehabilitasyon ve sosyal faaliyetler",
      "Spor organizasyonları, amatör kulüp destekleri ve yaz spor okulları"
    ],
    "kaynak": "https://www.dortyol.bel.tr/mudurluk/kultur-sanat-ve-sosyal-isler-mudurlugu"
  },
  "Destek Hizmetleri Müdürlüğü": {
    "mudur": "Bedir ÇELEBİ",
    "telefon_dahili": "2000",
    "aciklama": "Destek Hizmetleri Müdürlüğü; karar alma, uygulama ve eylemlerde şeffaflık, hizmetlerin temin ve sunumunda yerindelik ve ihtiyaca uygunluk, hesap verebilirlik, katılımcılık, adil ve eşit hizmet, kaynakların etkin ve verimli kullanımı ile sürdürülebilirlik ilkelerini esas alır. Belediyeye ait bina ve tesislerin ısıtma-soğutma, bakım-onarım hizmetleri, kırtasiye ve malzeme tedariki, taşınır kayıt işlemleri ve hizmet araçlarının yönetiminden sorumludur.",
    "gorevler": [
      "Belediye binalarının bakım, onarım ve tamirat hizmetleri",
      "Kırtasiye, temizlik ve ofis malzemelerinin satın alınması ve dağıtımı",
      "Hizmet araçlarının tescil, sigorta, bakım ve tahsis işlemleri",
      "Taşınır kayıt ve kontrol işlemlerinin yürütülmesi",
      "Asansör, jeneratör ve yangın güvenlik sistemlerinin bakımı",
      "Satın alma taleplerinin karşılanması ve depo yönetimi"
    ],
    "kaynak": "https://www.dortyol.bel.tr/mudurluk/destek-hizmetleri-mudurlugu"
  },
  "Ruhsat ve Denetim Müdürlüğü": {
    "mudur": "Zeki ÖZBERK",
    "telefon_dahili": "1085",
    "aciklama": "Ruhsat ve Denetim Müdürlüğü; ilgili kanunlar ve yönetmelikler doğrultusunda Belediye tarafından ruhsatlandırılması gereken iş yerlerinin İş Yeri Açma ve Çalıştırma Ruhsatı işlemlerini düzenli ve koordineli bir şekilde yürütmek ve denetlemesinden sorumludur.",
    "gorevler": [
      "İş yeri açma ve çalıştırma ruhsatı düzenlenmesi",
      "Umuma açık istirahat ve eğlence yeri ruhsatı işlemleri",
      "Gıda sicil belgesi ve hafta tatili izin ruhsatı düzenlenmesi",
      "Ruhsatsız işyerlerinin Zabıta Müdürlüğü ile koordineli denetimi",
      "İşyeri devir, nakil ve adres güncelleme işlemleri",
      "Ölçü ve ayar aletlerinin denetimi"
    ],
    "kaynak": "https://www.dortyol.bel.tr/mudurluk/ruhsat-ve-denetim-mudurlugu"
  }
};
