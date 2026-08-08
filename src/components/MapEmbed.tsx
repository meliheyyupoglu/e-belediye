export default function MapEmbed() {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      <iframe
        title="Dörtyol Belediyesi Konumu"
        src="https://maps.google.com/maps?q=Numune+Evler+Mahallesi+İstasyon+Caddesi+Dörtyol+Hatay&output=embed&hl=tr"
        width="100%"
        height="350"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
