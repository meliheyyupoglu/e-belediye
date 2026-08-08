interface Props {
  lat: number;
  lng: number;
  adres?: string;
}

export default function MapLocationView({ lat, lng, adres }: Props) {
  const src = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed&hl=tr`;
  return (
    <div className="mt-4">
      <p className="text-xs text-gray-400 mb-2">Bildirilen Konum</p>
      {adres && <p className="text-sm text-gray-700 mb-2">{adres}</p>}
      <div className="rounded-xl overflow-hidden border border-gray-200">
        <iframe
          title="Şikayet konumu"
          src={src}
          width="100%"
          height="220"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
