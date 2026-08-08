"use client";

import { useEffect, useState } from "react";
import { Circle, MapContainer, Marker, TileLayer, Tooltip, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { DORTYOL_CENTER, MAHALLE_NOKTALARI } from "@/lib/harita";
import type { AddressFormat } from "@/lib/geocode";
import type { KesintiBolgesi } from "@/lib/db";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export interface MapLocation {
  lat: number;
  lng: number;
  adres?: string;
  il?: string;
  ilce?: string;
  mahalle?: string;
  caddeSokak?: string;
  binaNo?: string;
}

interface Props {
  value: MapLocation | null;
  onChange: (loc: MapLocation) => void;
  onGeocodeLoading?: (loading: boolean) => void;
  mapLabel: string;
  addressFormat: AddressFormat;
  kesintiTip?: string;
}

function ClickHandler({ onChange }: { onChange: (loc: MapLocation) => void }) {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

async function fetchAddress(lat: number, lng: number, format: AddressFormat) {
  const res = await fetch(`/api/geocode/reverse?lat=${lat}&lng=${lng}&format=${format}`);
  if (!res.ok) return null;
  return res.json() as Promise<{
    il: string; ilce: string; mahalle: string; caddeSokak: string; binaNo: string; formatted: string;
  }>;
}

export default function MapPickerInner({
  value, onChange, onGeocodeLoading, mapLabel, addressFormat, kesintiTip,
}: Props) {
  const [geoLoading, setGeoLoading] = useState(false);
  const [kesintiler, setKesintiler] = useState<KesintiBolgesi[]>([]);

  useEffect(() => {
    if (!kesintiTip) return;
    fetch(`/api/kesinti?tip=${kesintiTip}`)
      .then((r) => r.json())
      .then(setKesintiler)
      .catch(() => setKesintiler([]));
  }, [kesintiTip]);

  async function handleLocationChange(loc: MapLocation) {
    onChange(loc);
    onGeocodeLoading?.(true);
    const parsed = await fetchAddress(loc.lat, loc.lng, addressFormat);
    if (parsed) {
      onChange({
        ...loc,
        adres: parsed.formatted,
        il: parsed.il,
        ilce: parsed.ilce,
        mahalle: parsed.mahalle,
        caddeSokak: parsed.caddeSokak,
        binaNo: parsed.binaNo,
      });
    }
    onGeocodeLoading?.(false);
  }

  function locateMe() {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handleLocationChange({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoLoading(false);
      },
      () => setGeoLoading(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  const center: [number, number] = value
    ? [value.lat, value.lng]
    : [DORTYOL_CENTER.lat, DORTYOL_CENTER.lng];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="form-label mb-0">{mapLabel}</label>
        <button type="button" onClick={locateMe} disabled={geoLoading}
          className="text-xs font-medium text-primary hover:underline disabled:opacity-50">
          {geoLoading ? "Konum alınıyor..." : "Konumumu Bul"}
        </button>
      </div>
      <div className="map-picker rounded-xl border border-gray-200 shadow-sm">
        <MapContainer center={center} zoom={value ? 16 : 14} className="h-full w-full" scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onChange={handleLocationChange} />
          {MAHALLE_NOKTALARI.map((m) => (
            <Circle key={m.ad} center={[m.lat, m.lng]} radius={400} pathOptions={{ color: "#94a3b8", fillColor: "#cbd5e1", fillOpacity: 0.08, weight: 1 }}>
              <Tooltip permanent direction="center" className="mahalle-label">{m.ad}</Tooltip>
            </Circle>
          ))}
          {kesintiler.map((k) => (
            <Circle key={k.id} center={[k.lat, k.lng]} radius={300} pathOptions={{ color: "#ef4444", fillColor: "#fca5a5", fillOpacity: 0.25, weight: 2 }}>
              <Tooltip>{k.mahalle}: {k.aciklama}</Tooltip>
            </Circle>
          ))}
          {value && <Marker position={[value.lat, value.lng]} />}
        </MapContainer>
      </div>
      {kesintiler.length > 0 && (
        <p className="mt-2 text-xs text-red-600">Kırmızı alanlar: aktif kesinti/ariza bildirimi yapılmış bölgeler.</p>
      )}
      <p className="mt-1 text-xs text-gray-500">
        Haritaya tıklayarak konum seçin. Adres otomatik olarak aşağıdaki alana yazılır.
      </p>
    </div>
  );
}
