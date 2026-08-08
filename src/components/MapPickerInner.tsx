"use client";

import { useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { DORTYOL_CENTER } from "@/lib/harita";
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
}

interface Props {
  value: MapLocation | null;
  onChange: (loc: MapLocation) => void;
  mapLabel: string;
}

function ClickHandler({ onChange }: { onChange: (loc: MapLocation) => void }) {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&accept-language=tr`
    );
    if (!res.ok) return "";
    const data = await res.json();
    return data.display_name || "";
  } catch {
    return "";
  }
}

export default function MapPickerInner({ value, onChange, mapLabel }: Props) {
  const [geoLoading, setGeoLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);

  async function handleLocationChange(loc: MapLocation) {
    onChange(loc);
    setAddressLoading(true);
    const adres = await reverseGeocode(loc.lat, loc.lng);
    if (adres) onChange({ ...loc, adres });
    setAddressLoading(false);
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

  const center = value ? [value.lat, value.lng] as [number, number] : [DORTYOL_CENTER.lat, DORTYOL_CENTER.lng];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="form-label mb-0">{mapLabel} *</label>
        <button
          type="button"
          onClick={locateMe}
          disabled={geoLoading}
          className="text-xs font-medium text-primary hover:underline disabled:opacity-50"
        >
          {geoLoading ? "Konum alınıyor..." : "Konumumu Bul"}
        </button>
      </div>
      <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm z-0">
        <MapContainer
          center={center}
          zoom={value ? 16 : 14}
          className="h-72 w-full"
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onChange={handleLocationChange} />
          {value && <Marker position={[value.lat, value.lng]} />}
        </MapContainer>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Haritaya tıklayarak konum seçin. Dörtyol ilçe sınırları içinde olmalıdır.
      </p>
      {value && (
        <div className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-800">
          <span className="font-medium">Seçilen konum:</span>{" "}
          {addressLoading ? "Adres alınıyor..." : value.adres || `${value.lat.toFixed(5)}, ${value.lng.toFixed(5)}`}
        </div>
      )}
    </div>
  );
}
