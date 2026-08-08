export function slugify(name: string): string {
  const map: Record<string, string> = {
    "Fen İşleri Müdürlüğü": "fen-isleri-mudurlugu",
    "İmar ve Şehircilik Müdürlüğü": "imar-ve-sehircilik-mudurlugu",
    "Park ve Bahçeler Müdürlüğü": "park-ve-bahceler-mudurlugu",
    "Zabıta Müdürlüğü": "zabita-mudurlugu",
    "Temizlik İşleri Müdürlüğü": "temizlik-isleri-mudurlugu",
    "Bilgi İşlem Müdürlüğü": "bilgi-islem-mudurlugu",
    "Basın Yayın ve Halkla İlişkiler Müdürlüğü": "basin-yayin-ve-halkla-iliskiler-mudurlugu",
    "Afet İşleri ve Risk Yönetimi Müdürlüğü": "afet-isleri-ve-risk-yonetimi-mudurlugu",
    "Emlak ve İstimlak Müdürlüğü": "emlak-ve-istimlak-mudurlugu",
    "Su ve Kanalizasyon İşleri": "su-ve-kanalizasyon-isleri",
    "Kültür Sanat ve Sosyal İşler Müdürlüğü": "kultur-sanat-ve-sosyal-isler-mudurlugu",
    "Destek Hizmetleri Müdürlüğü": "destek-hizmetleri-mudurlugu",
    "Ruhsat ve Denetim Müdürlüğü": "ruhsat-ve-denetim-mudurlugu",
  };
  return map[name] || name.toLowerCase().replace(/\s+/g, "-");
}

export const MUDURLUK_TO_SLUG: Record<string, string> = {
  "Fen İşleri Müdürlüğü": "fen-isleri-mudurlugu",
  "İmar ve Şehircilik Müdürlüğü": "imar-ve-sehircilik-mudurlugu",
  "Park ve Bahçeler Müdürlüğü": "park-ve-bahceler-mudurlugu",
  "Zabıta Müdürlüğü": "zabita-mudurlugu",
  "Temizlik İşleri Müdürlüğü": "temizlik-isleri-mudurlugu",
  "Bilgi İşlem Müdürlüğü": "bilgi-islem-mudurlugu",
  "Basın Yayın ve Halkla İlişkiler Müdürlüğü": "basin-yayin-ve-halkla-iliskiler-mudurlugu",
  "Afet İşleri ve Risk Yönetimi Müdürlüğü": "afet-isleri-ve-risk-yonetimi-mudurlugu",
  "Emlak ve İstimlak Müdürlüğü": "emlak-ve-istimlak-mudurlugu",
  "Su ve Kanalizasyon İşleri": "su-ve-kanalizasyon-isleri",
  "Kültür Sanat ve Sosyal İşler Müdürlüğü": "kultur-sanat-ve-sosyal-isler-mudurlugu",
  "Destek Hizmetleri Müdürlüğü": "destek-hizmetleri-mudurlugu",
  "Ruhsat ve Denetim Müdürlüğü": "ruhsat-ve-denetim-mudurlugu",
};

export const SLUG_TO_MUDURLUK: Record<string, string> = Object.fromEntries(
  Object.entries(MUDURLUK_TO_SLUG).map(([k, v]) => [v, k])
);
